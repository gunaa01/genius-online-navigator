import React, { useState } from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Download,
  Calendar,
  FileText,
  BarChart,
  Share2,
  Megaphone,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { useDemoData } from "@/hooks/useDemoData";
import { Report } from "@/hooks/useDemoData";
import axios from 'axios';

const Reports = () => {
  const { reports, loading } = useDemoData();
  const [searchTerm, setSearchTerm] = useState('');
  const [reportTypeFilter, setReportTypeFilter] = useState('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [generateForm, setGenerateForm] = useState({ type: 'website', dateRange: '7days', format: 'pdf', name: '' });
  const [scheduleForm, setScheduleForm] = useState({ type: 'website', frequency: 'weekly', email: '' });
  const [loadingModal, setLoadingModal] = useState(false);
  const [message, setMessage] = useState('');

  const filteredReports = reports.filter(report => {
    const nameMatch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = reportTypeFilter === 'all' || report.type === reportTypeFilter;
    return nameMatch && typeMatch;
  });

  const getReportIcon = (type: string) => {
    switch (type) {
      case "analytics":
        return <BarChart className="h-5 w-5" />;
      case "social":
        return <Share2 className="h-5 w-5" />;
      case "ads":
        return <Megaphone className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  async function handleGenerateReport() {
    setLoadingModal(true);
    setMessage('');
    try {
      const res = await axios.post('/api/reports', generateForm);
      setMessage('Report generated successfully!');
      setShowGenerateModal(false);
    } catch (e) {
      setMessage('Failed to generate report.');
    }
    setLoadingModal(false);
  }

  async function handleScheduleReport() {
    setLoadingModal(true);
    setMessage('');
    try {
      const res = await axios.post('/api/reports/schedule', scheduleForm);
      setMessage('Report scheduled successfully!');
      setShowScheduleModal(false);
    } catch (e) {
      setMessage('Failed to schedule report.');
    }
    setLoadingModal(false);
  }

  function handleShare(report) {
    if (navigator.share) {
      navigator.share({
        title: `Report: ${report.name}`,
        text: `Check out this report from Genius: ${report.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard!');
    }
  }

  function handleDownload(report) {
    // Simulate download (replace with real logic as needed)
    const blob = new Blob([
      `Report: ${report.name}\nType: ${report.type}\nDate: ${report.date}`
    ], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${report.name.replace(/\\s+/g, '_')}_report.txt`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <DashboardLayout>
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-8 min-w-[340px]">
            <h2 className="text-lg font-bold mb-4">Generate New Report</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Report Name</label>
              <input type="text" className="border rounded p-2 w-full mb-2" value={generateForm.name} onChange={e => setGenerateForm(f => ({ ...f, name: e.target.value }))} />
              <label className="block text-sm font-medium mb-1">Report Type</label>
              <select className="border rounded p-2 w-full mb-2" value={generateForm.type} onChange={e => setGenerateForm(f => ({ ...f, type: e.target.value }))}>
                <option value="website">Website Analytics</option>
                <option value="social">Social Media Performance</option>
                <option value="ads">Ad Campaign Results</option>
                <option value="revenue">Revenue Analysis</option>
                <option value="audience">Audience Insights</option>
              </select>
              <label className="block text-sm font-medium mb-1">Date Range</label>
              <select className="border rounded p-2 w-full mb-2" value={generateForm.dateRange} onChange={e => setGenerateForm(f => ({ ...f, dateRange: e.target.value }))}>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="12months">Last 12 Months</option>
                <option value="custom">Custom Range</option>
              </select>
              <label className="block text-sm font-medium mb-1">Format</label>
              <select className="border rounded p-2 w-full" value={generateForm.format} onChange={e => setGenerateForm(f => ({ ...f, format: e.target.value }))}>
                <option value="pdf">PDF Document</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="csv">CSV File</option>
                <option value="json">JSON Data</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowGenerateModal(false)} disabled={loadingModal}>Cancel</Button>
              <Button onClick={handleGenerateReport} disabled={loadingModal}>{loadingModal ? 'Generating...' : 'Generate'}</Button>
            </div>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-8 min-w-[340px]">
            <h2 className="text-lg font-bold mb-4">Schedule Report</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Report Type</label>
              <select className="border rounded p-2 w-full mb-2" value={scheduleForm.type} onChange={e => setScheduleForm(f => ({ ...f, type: e.target.value }))}>
                <option value="website">Website Analytics</option>
                <option value="social">Social Media Performance</option>
                <option value="ads">Ad Campaign Results</option>
                <option value="revenue">Revenue Analysis</option>
                <option value="audience">Audience Insights</option>
              </select>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <select className="border rounded p-2 w-full mb-2" value={scheduleForm.frequency} onChange={e => setScheduleForm(f => ({ ...f, frequency: e.target.value }))}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <label className="block text-sm font-medium mb-1">Recipient Email</label>
              <input type="email" className="border rounded p-2 w-full" value={scheduleForm.email} onChange={e => setScheduleForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowScheduleModal(false)} disabled={loadingModal}>Cancel</Button>
              <Button onClick={handleScheduleReport} disabled={loadingModal}>{loadingModal ? 'Scheduling...' : 'Schedule'}</Button>
            </div>
          </div>
        </div>
      )}
      {message && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 text-green-900 p-3 rounded shadow">{message}</div>
      )}
      <div className="flex flex-col space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground">View and generate detailed reports about your business performance</p>
          </div>
          <Button onClick={() => setShowGenerateModal(true)}>
            <Plus className="mr-2 h-4 w-4" /> Generate New Report
          </Button>
        </header>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Report Generator</CardTitle>
            <CardDescription>Create customized reports for your business needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select defaultValue="website">
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website Analytics</SelectItem>
                    <SelectItem value="social">Social Media Performance</SelectItem>
                    <SelectItem value="ads">Ad Campaign Results</SelectItem>
                    <SelectItem value="revenue">Revenue Analysis</SelectItem>
                    <SelectItem value="audience">Audience Insights</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select defaultValue="7days">
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="12months">Last 12 Months</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Format</label>
                <Select defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowScheduleModal(true)}>
                <Calendar className="mr-2 h-4 w-4" /> Schedule Report
              </Button>
              <Button variant="default" className="ml-2" onClick={handleGenerateReport}>
                <FileText className="mr-2 h-4 w-4" /> Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
          <h2 className="text-xl font-bold">Recent Reports</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search reports..." 
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="ads">Ad Campaigns</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> More Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="card-shadow hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    {getReportIcon(report.type)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{report.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Generated on {new Date(report.date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{report.type.charAt(0).toUpperCase() + report.type.slice(1)}</span>
                  <span>PDF Format</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => handleShare(report)}>
                  <Share2 className="mr-1 h-4 w-4" /> Share
                </Button>
                <Button variant="default" size="sm" onClick={() => handleDownload(report)}>
                  <Download className="mr-1 h-4 w-4" /> Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
