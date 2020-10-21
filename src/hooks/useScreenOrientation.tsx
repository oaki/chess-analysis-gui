import {useEffect, useState} from "react";

export enum Orientation {
    'landscape'='landscape',
    'portrait'='portrait',
}
function getOrientation(){
    if(window.innerWidth > window.innerHeight){
        return Orientation.landscape
    }

    return Orientation.portrait;
}
export const useScreenOrientation = () => {
    const [orientation, setOrientation] = useState(getOrientation())

    const updateOrientation = event => {
        setOrientation(getOrientation())
    }

    useEffect(() => {
        window.addEventListener('resize', updateOrientation)
        return () => {
            window.removeEventListener('resize', updateOrientation)
        }
    }, [])

    return orientation
}