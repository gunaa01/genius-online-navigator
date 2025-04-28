
interface QuoteTestimonialProps {
  quote: string;
  author: string;
  title?: string;
}

const QuoteTestimonial = ({ quote, author, title }: QuoteTestimonialProps) => {
  return (
    <div className="border-l-4 border-primary pl-4 italic">
      <p>{quote}</p>
      <p className="text-sm text-muted-foreground mt-2">
        – {author}{title && `, ${title}`}
      </p>
    </div>
  );
};

export default QuoteTestimonial;
