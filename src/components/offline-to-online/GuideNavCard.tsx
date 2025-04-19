
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface GuideNavCardProps {
  title: string;
  description: string;
  items: string[];
}

const GuideNavCard = ({ title, description, items }: GuideNavCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center text-sm">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default GuideNavCard;
