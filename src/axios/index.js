import axios from 'axios';
import store from '@/store';

axios.interceptors.request.use(
    async function(config) {
        console.log('axios.interceptor');

        if (!store.getters['loginStore/isLogin'])
            return config;

        if (!store.getters['loginStore/isAccessTokenExpired'])
            return config;

        try {
            await store.dispatch('loginStore/doRefreshToken');
            // header 재설정
            config.headers['Access-Token'] = store.state.loginStore.accessToken;
        } catch(err) {
            alert(' 다시 로그인을 해주시기 바랍니다.' + err.response.data.errormessage);
            // 여기서 끝내야 맞는거아니야? 실패했을때 이상한 acceeToken으로 이제 api 호출하는거야? ㅇㅇ accessToken이 만료됐다고 뜨겠지. 근데 리프레시가 실패할수도있거든.. 리프레시 실패하면 다시로그인해달라고 뜨고
            // 일단 요청은 가는데 일단 유효하지않은 토큰으로 호출하고
            // 응답은 인증실패라고 떨어질거고. 그러면 403에대한 처리를 해주면 됨.
        }
        return config;
    },
    function(error) {
        return Promise.reject(error);
    });

// axios.interceptors.response.use(function (response) {
//     // 응답 데이터로 처리
//     return response;
// }, async function (error) {
//     // 응답 오류에 대한 처리
//     //console.log(error.response);
//     // 에러가 발생한 요청 정보를 가져옵니다.
//     const axiosRequest = error.config;
//     if (error.response && !axiosRequest._retry) {
//         axiosRequest._retry = true;
//         // 응답코드가 403이고 응답 메시지가 "Authentication fail"때만 처리합니다.
//         if (error.response.status === 403 && error.response.data.errormessage === "Authentication fail") {
//             // 로그인되었는지 확인한다.
//             var isLogin = store.getters['loginStore/isLogin'];
//             if (isLogin) {
//                 // accessToken이 만료되면 토큰 재발급을 진행합니다.
//                 try {
//                     // accessToken 재발급 요청
//                     await store.dispatch("loginStore/doRefreshToken");
//                     // 재발급된 accessToken으로 해더를 수정합니다.
//                     axiosRequest.headers['Access-Token'] = store.state.loginStore.accessToken;
//                     // 다시 요청 정보로 요청(request)합니다.
//                     return axios(axiosRequest);
//                 } catch(err) {
//                     alert("다시 로그인을 해주시기 바랍니다.\n" + err.response.data.errormessage);
//                 }
//             }
//         }
//     }
//     return Promise.reject(error);
// });

// 요청때 실행하는게 더 효율적이지.

export default axios;