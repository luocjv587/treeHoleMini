Page({
  data(){
    return {
      backUrl: "https://treehole.zecrs.com",
      countDownSecond: 80000,
      startTime: "2020-07-14",
      existsTimeArr: {
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
      },
      openFeelingDown: false,
      letterInfo: "",
      sendLetterInfo: "Hi, \n",
      likeNum:0,
      getNum:0,
      openSend: true,
      currentLetterId: 1,
      likeSend: true,
    }
  },
  onLoad: function () {
    this.setDefault();
    this.getSeconds();
    this.existTime();
    this.countDown();

  },
  setDefault(){
    this.setData({
      backUrl: "https://treehole.zecrs.com",
      countDownSecond: 80000,
      startTime: "2020-07-14",
      existsTimeArr: {
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
      },
      openFeelingDown: false,
      letterInfo: "",
      sendLetterInfo: "Hi, \n",
      likeNum:0,
      getNum:0,
      openSend: true,
      currentLetterId: 1,
      likeSend: true,
    })
  },


  //获取毁灭倒计时
  countDown() {
    let interval = setInterval(() => {
      if (this.data.countDownSecond <= 0) {
        clearInterval(interval);
      }
      this.setData({
        countDownSecond : this.data.countDownSecond -= 1
      })
    }, 1000);
  },
  //获取存在时间
  existTime() {
    setInterval(() => {
      console.log('this.data.startTime',this.data.startTime)
      let startTime = this.data.startTime
      let s1 = new Date(startTime.replace(/-/g, "/")),
        s2 = new Date(),
        runTime = parseInt((s2.getTime() - s1.getTime()) / 1000);
      let year = Math.floor(runTime / 86400 / 365);
      runTime = runTime % (86400 * 365);
      let month = Math.floor(runTime / 86400 / 30);
      runTime = runTime % (86400 * 30);
      let day = Math.floor(runTime / 86400);
      runTime = runTime % 86400;
      let hour = Math.floor(runTime / 3600);
      runTime = runTime % 3600;
      let minute = Math.floor(runTime / 60);
      runTime = runTime % 60;
      let second = runTime;

      let tmpExistsTimeArr = this.data.existsTimeArr
      tmpExistsTimeArr.year = year;
      tmpExistsTimeArr.month = month;
      tmpExistsTimeArr.day = day;
      tmpExistsTimeArr.hour = hour;
      tmpExistsTimeArr.minute = minute;
      tmpExistsTimeArr.second = second;
      this.setData({
        existsTimeArr : tmpExistsTimeArr
      })


    }, 1000);
  },
  feelingDown() {
    this.data.openFeelingDown = true
  },
  //获取倒计时
  async getSeconds() {
    let that = this
    await wx.request({
      url: this.data.backUrl + '/getSecond',
      data: {
      },
      method:"GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data.data)
        that.setData({
          countDownSecond:res.data.data
        })
      }
    })


  },
  //获取一封信
  async getLetter() {
    // let result = await axios.get(this.backUrl + '/getLetter')
    // this.data.letterInfo = result.data.data.letter_info
    // this.data.currentLetterId = result.data.data.id
    // this.data.likeNum = result.data.data.like
    // this.data.getNum = result.data.data.get
    // this.data.likeSend = true
    // window.scrollTo(0, 0)

    let that = this
    await wx.request({
      url: this.data.backUrl + '/getLetter',
      data: {
      },
      method:"GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (result) {
        that.setData({
          letterInfo:result.data.data[0].letterInfo,
          currentLetterId:result.data.data[0].id,
          likeNum:result.data.data[0].likeCount,
          getNum:result.data.data[0].getCount,
          likeSend:true
        })
        // window.scrollTo(0, 0)
        wx.pageScrollTo({
          scrollTop: 0
        })
      }
    })


  },
  //发送一封信
  async sendLetter() {
    // await axios.post(this.backUrl + '/createLetter', {
    //   letter_info: this.sendLetterInfo,
    // })
    let that = this
    await wx.request({
      url: this.data.backUrl + '/createLetter',
      data: {
        letterInfo: this.data.sendLetterInfo,
      },
      method:"POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (result) {
        that.setData({
          openSend:false,
          letterInfo:"Hi, \n您的投递我们已收到。\n其他人将能够读到您写的东西，但您的名字或身份不会被附加到任何东西上。\n感谢您，我又可以多呆一会了～",
          likeSend:false,
        })
        wx.pageScrollTo({
          scrollTop: 0
        })
      }
    })
  },
  //喜爱
  async like() {
    // let result = await axios.post(this.backUrl + '/likeLetter', {
    //   letter_id: this.data.currentLetterId
    // })
    // if (result.data.code === "1"){
    //   this.data.likeNum += 1
    //   this.data.likeSend = false
    // }

    let that = this
    await wx.request({
      url: this.data.backUrl + '/likeLetter',
      data: {
        letterId: this.data.currentLetterId
      },
      method:"POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (result) {
        if (result.data.success === true) {
          that.setData({
            likeNum: that.data.likeNum += 1,
            likeSend: false
          })
        }
      }
    })


  },
  changeFeelingDown(){
    this.setData({
      openFeelingDown : true
    })
  },
  setLetterInfo:function(e){
    this.setData({
      sendLetterInfo:e.detail.value
    })
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../privacy/privacy'
    })
  },
})
