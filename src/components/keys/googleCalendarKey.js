// const appSecret = 'c82fa05a69e01ca1a109e252f0f580bb';
// const appID = '315403461893554';
// const shortToken = 'EAAEe25dOnbIBAENjbMAdmMyS193aZCsZBiLzKfDZBsWqng9ZAqdJc7MFU8YFtZCg9oYDPUokAy1MRuO8e68OnPNQHWCtPoEKUYcZAjoZBHBdWZAYVHiB3tDjoawt4Vl6rDnGKkQ65BChyIdeCGLZCQ0fZCea1nMaoNopWxY37IZBsoRyQy3lb24yXkXHZCUKvoHuuz4ED6wCOvZBHVFpDiDS6H6YUxdo9GUiE0NoZD';

/*  if you need to get a permanent token, you need to get a short live token then use that to get a long live token then use that to get a permanent token
axios.get(`https://graph.facebook.com/v2.10/oauth/access_token?grant_type=fb_exchange_token&client_id=${appID}&client_secret=${appSecret}&fb_exchange_token=${shortToken}'`)
  .then ( res => {
    const longlived = res.data.access_token;

    axios.get (`https://graph.facebook.com/v2.10/582285329/accounts?access_token=${longlived}`)
      .then (res => {
        console.log('res', res.data.data[0].access_token);
        
      })
  })
*/

export default {
  key:'AIzaSyClgIYnmb41QshyVSzQlxhdnbD03Vl0lHk'
}