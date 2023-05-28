export default {
  data() {

  },
  methods: {
    loadUserInfo(token){
      this.request.get("/user/getUserByToken", { params: { token: token } }).then(res => {
        if (res.code == 200) {
          return res.result
        }
      })
    }
  }
}
