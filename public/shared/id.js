import { getDiff } from '../client/object-utilities';
import { get } from 'http';

let num = 0;

export function get() {
  return num++;
}
