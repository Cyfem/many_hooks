import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';

const globalName: string = '__globalState__';
const globalSubscriberName: string = '__globalStateSubscriber__';
declare var window: any;
window[globalName] = new Proxy({} as any, {set: (target, key, newValue) => {

    target[key] = newValue;

    for(const subsciberKey in Object(window[globalSubscriberName][key])){
        window[globalSubscriberName][key][subsciberKey](newValue);
    };

    return true;
}});
window[globalSubscriberName] = {};

/**
 * @param initialValue a initial value when global state be created
 * @param name for debug, you can view it throw window[globalName][name]
 */
export const createGlobalState = <T>(initialValue: T, name: string | number | symbol = Symbol()): (elementName?: string | number | symbol) => [T, Dispatch<T>] => {
    window[globalName][name] = initialValue;
    window[globalSubscriberName][name] = {};

    return (elementName: string | number | symbol = Symbol()): [T, Dispatch<T>] => {

        const [state, setState] = useState(window[globalName][name]);
        
        useEffect(() => {
            return () => {
                delete window[globalSubscriberName][name][elementName]
            }
        }, [])

        window[globalSubscriberName][name][elementName] = setState;
        
        return [window[globalName][name], (value: T) => {
            window[globalName][name] = value;
        }]
        
    }
}