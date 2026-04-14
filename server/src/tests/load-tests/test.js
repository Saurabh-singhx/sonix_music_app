
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m',  target: 100 },
    { duration: '30s', target: 400 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const res = http.post('http://sonixapi.saurabhx.site/api/v1/public/ragister-guest');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  console.log(res.status);
  sleep(1);
}