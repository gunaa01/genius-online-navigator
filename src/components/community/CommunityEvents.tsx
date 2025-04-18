
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Plus, CalendarPlus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees?: number;
  tags: string[];
  isUserEvent: boolean;
};

const CommunityEvents = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Downtown Summer Festival",
      description: "Annual festival featuring local businesses, food, and music",
      date: "2025-06-15",
      time: "12:00 PM - 8:00 PM",
      location: "Main Street Plaza",
      attendees: 245,
      maxAttendees: 500,
      tags: ["festival", "community", "summer"],
      isUserEvent: false
    },
    {
      id: "2",
      title: "Coffee Tasting Workshop",
      description: "Learn about different coffee origins and brewing methods",
      date: "2025-05-10",
      time: "3:00 PM - 5:00 PM",
      location: "Downtown Coffee",
      attendees: 18,
      maxAttendees: 25,
      tags: ["workshop", "coffee", "tasting"],
      isUserEvent: true
    },
    {
      id: "3",
      title: "Book Club: May Meeting",
      description: "Discussion of 'The Midnight Library' by Matt Haig",
      date: "2025-05-20",
      time: "7:00 PM - 8:30 PM",
      location: "Bookworm Haven",
      attendees: 12,
      maxAttendees: 20,
      tags: ["book-club", "discussion", "reading"],
      isUserEvent: false
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: ""
  });

  const [sheetOpen, setSheetOpen] = useState(false);

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.time || !newEvent.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newEventObj: Event = {
      id: (events.length + 1).toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      attendees: 0,
      tags: ["new-event"],
      isUserEvent: true
    };

    setEvents([...events, newEventObj]);
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: ""
    });
    setSheetOpen(false);

    toast({
      title: "Event created!",
      description: "Your new event has been created successfully",
    });
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    toast({
      title: "Event deleted",
      description: "The event has been removed from your calendar",
    });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Community Events</h2>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <CalendarPlus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create New Event</SheetTitle>
              <SheetDescription>
                Create an event to engage with your community
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title">Event Title</label>
                <Input 
                  id="title" 
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="e.g. Coffee Tasting Workshop"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Description</label>
                <Input 
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Describe your event"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="date">Date</label>
                  <Input 
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="time">Time</label>
                  <Input 
                    id="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    placeholder="e.g. 3:00 PM - 5:00 PM"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="location">Location</label>
                <Input 
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  placeholder="Event location"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSheetOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateEvent}>Create Event</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className={`${event.isUserEvent ? 'border-primary/30' : ''}`}>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                {event.isUserEvent && (
                  <Button variant="ghost" size="sm" onClick={() => deleteEvent(event.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2" />
                {event.time}
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                {event.location}
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2" />
                {event.attendees} attending {event.maxAttendees ? `(${event.maxAttendees - event.attendees} spots left)` : ''}
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {event.isUserEvent ? "Manage Event" : "Attend Event"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityEvents;
