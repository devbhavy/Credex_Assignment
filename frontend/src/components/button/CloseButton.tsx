import { useNavigate } from "react-router"

export function CloseButton(){
    const navigate = useNavigate();
    
    return (
        <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Back to home"
        className="group fixed top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-red-500 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-400 transition-colors group-hover:text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
        
    )
}