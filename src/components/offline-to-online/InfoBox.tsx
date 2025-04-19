
interface InfoBoxProps {
  title: string;
  items: Array<{
    id: string | number;
    content: string | JSX.Element;
  }>;
  numbered?: boolean;
}

const InfoBox = ({ title, items, numbered = false }: InfoBoxProps) => {
  return (
    <div className="bg-muted rounded-lg p-6">
      <h3 className="font-semibold mb-3">{title}</h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} className="flex items-start">
            <span className="font-medium mr-2">{numbered ? `${item.id}.` : '•'}</span>
            <span>{item.content}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfoBox;
