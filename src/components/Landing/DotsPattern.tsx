export default function DotsPattern() {
  return (
   <div className="w-full h-full top-0 absolute overflow-hidden -z-1">
        <div 
            className="absolute inset-0"
            style={{
                backgroundImage: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px', // This controls the structural spacing between each dot
            }}
        />
        </div>
  );
}