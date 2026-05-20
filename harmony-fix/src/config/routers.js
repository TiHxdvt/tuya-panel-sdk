import _ from 'lodash';
import Home from '../scenes/Home';
// import BasicCategory from '../scenes/Basic';
import LampCategory from '../scenes/Lamp';
// import StandardCategory from '../scenes/Standard';
// import SensorCategory from '../scenes/Sensor';
import SweepRobotCategory from '../scenes/SweepRobot';
import Health from '../scenes/Health';
import LockCategory from '../scenes/Lock';
import GateWayCategory from '../scenes/Gateway';
// import CbtCategory from '../scenes/Cbt';
import AnimationCategory from '../scenes/Animation';
import Remote from '../scenes/Remote';
import Ipc from '../scenes/Ipc';
import Electrician from '../scenes/Electrician';
import ApiScene from '../scenes/ApiScene';
import Outdoor from '../scenes/Outdoor';
import Szos from '../scenes/Szos';
import Sensing from '../scenes/Sensing';

import { traverseRouters } from '../utils';

// 硬编码包信息（避免 watchFolders 导致的 node_modules 冲突）
const LampInfo = { name: '@tuya/tuya-panel-lamp-sdk', version: '1.14.1' };
const RobotInfo = { name: '@tuya/tuya-panel-robot-sdk', version: '1.3.1' };
const ApiSceneInfo = { name: '@tuya/tuya-panel-api', version: '1.12.0' };
const HealthInfo = { name: '@tuya/tuya-panel-health-sdk', version: '1.3.0' };
const GatewayInfo = { name: '@tuya/tuya-panel-gateway-sdk', version: '1.9.1' };
const AnimationInfo = { name: '@tuya/tuya-panel-animation-sdk', version: '1.6.0' };
const RemoteInfo = { name: '@tuya/tuya-panel-remote-sdk', version: '0.9.1' };
const IpcInfo = { name: '@tuya/tuya-panel-ipc-sdk', version: '1.22.0' };
const ElectricianInfo = { name: '@tuya/tuya-panel-electrician-sdk', version: '1.4.5' };
const LockInfo = { name: '@tuya/tuya-panel-lock-sdk', version: '1.9.17' };
const OutdoorInfo = { name: '@tuya/tuya-panel-outdoor-sdk', version: '0.9.0' };
const SzosInfo = { name: '@tuya/tuya-panel-szos-sdk', version: '1.3.0' };
const SensingInfo = { name: '@tuya/tuya-panel-sensing-sdk', version: '0.2.0' };

const mainRouter = [
  {
    id: 'main',
    Scene: Home,
  },
];

export const elementsRouters = _.sortBy(
  [
    {
      id: 'Lock',
      title: LockInfo.name,
      subTitle: LockInfo.version,
      Scene: LockCategory,
    },
    {
      id: 'Lamp',
      title: LampInfo.name,
      subTitle: LampInfo.version,
      Scene: LampCategory,
    },
    {
      id: 'SweepRobot',
      title: RobotInfo.name,
      subTitle: RobotInfo.version,
      Scene: SweepRobotCategory,
    },
    {
      id: 'Health',
      title: HealthInfo.name,
      subTitle: HealthInfo.version,
      Scene: Health,
    },
    {
      id: 'Gateway',
      title: GatewayInfo.name,
      subTitle: GatewayInfo.version,
      Scene: GateWayCategory,
    },
    {
      id: 'Animation',
      title: AnimationInfo.name,
      subTitle: AnimationInfo.version,
      Scene: AnimationCategory,
    },
    {
      id: 'Remote',
      title: RemoteInfo.name,
      subTitle: RemoteInfo.version,
      Scene: Remote,
    },
    {
      id: 'Ipc',
      title: IpcInfo.name,
      subTitle: IpcInfo.version,
      Scene: Ipc,
    },
    {
      id: 'Electrician',
      title: ElectricianInfo.name,
      subTitle: ElectricianInfo.version,
      Scene: Electrician,
    },
    {
      id: 'ApiScene',
      title: ApiSceneInfo.name,
      subTitle: ApiSceneInfo.version,
      Scene: ApiScene,
    },
    {
      id: 'Outdoor',
      title: OutdoorInfo.name,
      subTitle: OutdoorInfo.version,
      Scene: Outdoor,
    },
    {
      id: 'Szos',
      title: SzosInfo.name,
      subTitle: SzosInfo.version,
      Scene: Szos,
    },
    {
      id: 'Sensing',
      title: SensingInfo.name,
      subTitle: SensingInfo.version,
      Scene: Sensing,
    },
  ],
  'id'
);

export const subRouters = [...traverseRouters(elementsRouters, 2)];

// all routers
export default [...mainRouter, ...elementsRouters, ...subRouters];
