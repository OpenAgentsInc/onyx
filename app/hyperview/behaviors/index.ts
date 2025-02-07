import { OpenUrlBehavior } from './OpenUrl';
import { NavigateBehavior } from './Navigate';
import { FetchBehavior } from './Fetch';

// Export behaviors in the format Hyperview expects
export default {
  'open-url': OpenUrlBehavior.callback,
  'navigate': NavigateBehavior.callback,
  'fetch': FetchBehavior.callback,
};