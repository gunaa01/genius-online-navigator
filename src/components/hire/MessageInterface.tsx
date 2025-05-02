
import React from 'react';

export default function MessageInterface() {
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="border-b p-4 bg-muted/30">
        <h2 className="font-medium text-lg">Messages</h2>
        <p className="text-sm text-muted-foreground">Chat with freelancers or clients</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Sample messages - would be dynamic in a real app */}
        <div className="flex gap-3 max-w-[80%]">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
            C
          </div>
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm">Hello! I'd like to discuss the project requirements in more detail.</p>
            <span className="text-xs text-muted-foreground mt-1 block">10:42 AM</span>
          </div>
        </div>
        
        <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            Y
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <p className="text-sm">Sure! I'd be happy to go over the details. Which aspect would you like to explore first?</p>
            <span className="text-xs text-muted-foreground mt-1 block">10:45 AM</span>
          </div>
        </div>
        
        <div className="flex gap-3 max-w-[80%]">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
            C
          </div>
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm">Let's start with the timeline. When do you think you can deliver the first draft?</p>
            <span className="text-xs text-muted-foreground mt-1 block">10:47 AM</span>
          </div>
        </div>
      </div>
      
      <div className="border-t p-4">
        <form className="flex gap-2">
          <input 
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
