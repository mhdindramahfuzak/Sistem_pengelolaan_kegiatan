export default function DetailRow({ icon, label, value, isFile, fileUrl }) {
    const IconComponent = icon;
    
    return (
        <div className="flex items-center gap-2">
            {typeof icon === 'string' ? (
                <span className="text-gray-500">{icon}</span>
            ) : (
                <IconComponent className="text-gray-500" />
            )}
            <span className="text-sm">
                {isFile && fileUrl ? (
                    <a href={fileUrl} target="_blank" className="text-blue-600 hover:underline">
                        {label}
                    </a>
                ) : (
                    value || label
                )}
            </span>
        </div>
    );
}