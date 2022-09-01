import axios from "axios";

const loginStore = {
    namespaced: true,
    state: {
        memberId: '',
        accessToken: '',
        refreshToken: '',
    },
    getters: { // 동기적
        isLogin(state) {
            return state.accessToken !== '';
        },
        isAccessTokenExpired(state) {
            // accessToken에서 .(도트)로 분리하여 payload를 가져옵니다.
            let base64Payload = state.accessToken.split('.')[1];
            // URL과 호환되지 않는 문자를 base64 표준 문자로 교체합니다.
            base64Payload = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
            // atob() 메소드로 복호화합니다.
            base64Payload = atob(base64Payload);
            // JSON 객체로 변환합니다.
            const payloadObject = JSON.parse(base64Payload);
            if (payloadObject.exp <= new Date().getTime() / 1000)
                return true;
            else
                return false;
        }
    },
    mutations: { // 동기적
        setMemberId(state, memberId) {
            state.memberId = memberId;
        },
        setAccessToken(state, accessToken) {
            state.accessToken = accessToken;
        },
        setRefreshToken(state, refreshToken) {
            state.refreshToken = refreshToken;
        },
        reset(state) {
            state.memberId = '';
            state.accessToken = '';
            state.refreshToken = '';
        }
    },
    actions: { // 비동기적
        async doLogin({ commit }, memberInfo) {
            let result = false;
            let resultErr = null;

            try {
                let res = await axios.post('http://localhost:9000/members/login', memberInfo);
                if (res.data.success) {
                    console.log('로그인되었습니다.');
                    commit('setMemberId', memberInfo.id);
                    commit('setAccessToken', res.data.accessToken);
                    commit('setRefreshToken', res.data.refreshToken);
                    axios.defaults.headers.common['Access-Token'] = res.data.accessToken;
                    result = true;
                } else {
                    console.log('로그인되지 않았습니다.');
                    let err = new Error('Request failed with status code 401');
                    err.response = {data: {success: false, errormessage: '로그인되지 않았습니다.'}};
                    resultErr = err;
                }
            } catch(err) {
                console.error(err);
                if (!err.response) {
                    err.response = {data: {success: false, errormessage: err.message}};
                }
                resultErr = err;
            }

            return new Promise((resolve, reject) => {
                if (result) {
                    resolve();
                } else {
                    reject(resultErr);
                }
            });
        },
        doLogout({commit}) {
            commit('reset');
            delete axios.defaults.headers.common['Access-Token'];
        },
        async doRefreshToken({commit, state}) {
            // state에있는 refreshToken으로 refresh 호출하면 되잖슴. commit은 가지고오긴 해야겠네
            try {
                const res = await axios.post('http://localhost:9000/members/refresh', {
                    id: state.memberId,
                    accessToken: state.accessToken,
                    refreshToken: state.refreshToken,
                });

                if (res.data.success) {
                    axios.defaults.headers.common['Access-Token'] = res.data.accessToken;
                    commit('setAccessToken', res.data.accessToken);
                    return new Promise((resolve) => {resolve();});
                } else {
                    let errormessage;
                    if (res.data.errormessage) errormessage = res.data.errormessage;
                    return new Promise((resolve, reject) => {
                        const err = new Error(errormessage);
                        err.response = {data: {success:false, errormessage: errormessage}};
                        reject(err);
                    });
                }
            } catch(err) {
                console.error(err);
                return new Promise((resolve, reject) => {
                    err.response = {data: {success: false, errormessage: err.message}};
                    reject(err);
                });
            }
        }
    },
};

export default loginStore;