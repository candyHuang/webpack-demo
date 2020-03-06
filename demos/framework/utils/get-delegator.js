import { Delegate } from 'dom-delegate';

let delegator = null;

export default function getDelegator() {
    if (!delegator) {
        delegator = new Delegate(document.body);
    }
    return delegator;
}
