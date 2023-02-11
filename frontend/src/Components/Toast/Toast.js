import toast from "react-hot-toast"


export const login = (message) => 
    toast.success(message,
    {
        duration: 4000,
        position: 'top-center'
    });

export const error = (message) => 
    toast.error(message,
    {
        duration: 4000,
        position: 'top-center'
    });