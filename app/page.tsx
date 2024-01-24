'use client';
 
import { useChat } from 'ai/react';
 
export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
 
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <p>Sample Image</p>
      <img 
      src='https://cdn.cliqueinc.com/posts/298692/streetwear-outfits-for-women-298692-1648082641136-main.700x0c.jpg'/>
      {messages.length > 0
        ? messages.map(m => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === 'user' ? 'User: ' : 'AI: '}
              {m.content}
            </div>
          ))
        : null}
 
      <form
        onSubmit={e => {
          handleSubmit(e, {
            data: {
              imageUrl:
                'https://cdn.cliqueinc.com/posts/298692/streetwear-outfits-for-women-298692-1648082641136-main.700x0c.jpg',
            },
          });
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Ask a question about this image"
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}