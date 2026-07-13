export const ErrorMessageList = ({ inputName, messages }: {inputName: string, messages: string[] | undefined}) => {
    return (
        <>
            {(messages && messages.length >= 1) &&
                <div className="bg-light-red/20 py-1 text-xs rounded px-2">
                    <p className="text-light-red font-bold capitalize">{inputName}</p>
                    <ul>
                        {messages?.map((msg,idx) =><li key={idx} className="list-disc list-inside error-msg-style">{msg}</li>)}
                    </ul>
                </div> 
            }
        </>
    )
}