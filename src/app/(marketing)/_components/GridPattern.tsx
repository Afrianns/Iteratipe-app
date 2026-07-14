export default function GridPattern() {
  return (
    <div className="absolute left-0 top-0 h-full w-full overflow-hidden -z-1">  
        <div 
            className="absolute inset-0"
            style={{
            backgroundImage: `
                linear-gradient(to right, rgba(147, 51, 234, 0.2) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(107, 114, 128, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(at top left, transparent 50%, black 80%)',
            }}
        />
</div>
  );
}