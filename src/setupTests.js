/* eslint-disable */

/* eslint-disable import/no-duplicates */
import Adapter from 'enzyme-adapter-react-16';
import { shallow, mount, configure } from 'enzyme';

configure({ adapter: new Adapter() });
global.shallow = shallow;
global.mount = mount;
