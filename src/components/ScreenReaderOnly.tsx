interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export default function ScreenReaderOnly({ 
  children, 
  as: Component = 'span' 
}: ScreenReaderOnlyProps) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
}