import { idFor } from '../utils/data.js';

/** A doctor or clinic name with its unique ID; people from old paper records have none. */
export default function WhoTag({ name }) {
  const id = idFor(name);
  return (<span className="who">{name} {id ? <code className="id">{id}</code> : <code className="id id--none">আইডি নেই</code>}</span>);
}
