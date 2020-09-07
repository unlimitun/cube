import React, { Component } from 'react'
// 传入width（例如 '100px'）和height（例如 '100px'）和size（例如 1） size是魔方大小系数，1为默认大小，0.5就是一半大小
// 使用方法rotate()来转动魔方 参数是R U L等以空格为间隔的字符串 例如 rotate(R U\' D2 F\') 
// 可接受的转动指令有 R U L B D F（顺时针） 以及上述字母加\'（逆时针） 以及上述字母加2（180度）
// 使用方法rotateWithTips来开启箭头和高亮来转动魔方 参数同上
// 使用方法setColor()来设置魔方颜色 参数为长度是54的数组，每个元素是0-5的数字 0黄色1橙色2蓝色3红色4绿色5白色
// 使用方法resetColor()来重置魔方颜色
// 使用方法setSpeed()调整播放速度 参数为数字 单位是秒 默认为1
enum Color {
    'yellow',
    'orange',
    'blue',
    'red',
    'green',
    'white'
}
interface Props{
    height?:string,
    width?:string,
    size?:number,
    onRef:Function
}
class Cube extends Component<Props,{}> {
    
    time = new Date()
    state = {
        colors: [
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            1, 1, 1, 1, 1, 1, 1, 1, 1,
            2, 2, 2, 2, 2, 2, 2, 2, 2,
            3, 3, 3, 3, 3, 3, 3, 3, 3,
            4, 4, 4, 4, 4, 4, 4, 4, 4,
            5, 5, 5, 5, 5, 5, 5, 5, 5
        ],
        size: this.props.size?this.props.size:1,
        stepTime: 1,
        aniState: true,
        viewAngle: 1,
        openTips: false,
        tipsData: [
            true, true, true, true, true, true, true, true, true,
            true, true, true, true, true, true, true, true, true,
            true, true, true, true, true, true, true, true, true,
            true, true, true, true, true, true, true, true, true,
            true, true, true, true, true, true, true, true, true,
            true, true, true, true, true, true, true, true, true],
        positionData: [
            [1, 0, 0, -1, -1, 1],//u面
            [1, 0, 0, 0, -1, 1],
            [1, 0, 0, 1, -1, 1],
            [1, 0, 0, -1, 0, 1],
            [1, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 1],
            [1, 0, 0, -1, 1, 1],
            [1, 0, 0, 0, 1, 1],
            [1, 0, 0, 1, 1, 1],
            [0, -1, 0, -1, -1, 1],//l面
            [0, -1, 0, 0, -1, 1],
            [0, -1, 0, 1, -1, 1],
            [0, -1, 0, -1, 0, 1],
            [0, -1, 0, 0, 0, 1],
            [0, -1, 0, 1, 0, 1],
            [0, -1, 0, -1, 1, 1],
            [0, -1, 0, 0, 1, 1],
            [0, -1, 0, 1, 1, 1],
            [0, 0, 0, -1, -1, 1],//f面
            [0, 0, 0, 0, -1, 1],
            [0, 0, 0, 1, -1, 1],
            [0, 0, 0, -1, 0, 1],
            [0, 0, 0, 0, 0, 1],
            [0, 0, 0, 1, 0, 1],
            [0, 0, 0, -1, 1, 1],
            [0, 0, 0, 0, 1, 1],
            [0, 0, 0, 1, 1, 1],
            [0, 1, 0, -1, -1, 1],//r面
            [0, 1, 0, 0, -1, 1],
            [0, 1, 0, 1, -1, 1],
            [0, 1, 0, -1, 0, 1],
            [0, 1, 0, 0, 0, 1],
            [0, 1, 0, 1, 0, 1],
            [0, 1, 0, -1, 1, 1],
            [0, 1, 0, 0, 1, 1],
            [0, 1, 0, 1, 1, 1],
            [0, 2, 0, -1, -1, 1],//b面
            [0, 2, 0, 0, -1, 1],
            [0, 2, 0, 1, -1, 1],
            [0, 2, 0, -1, 0, 1],
            [0, 2, 0, 0, 0, 1],
            [0, 2, 0, 1, 0, 1],
            [0, 2, 0, -1, 1, 1],
            [0, 2, 0, 0, 1, 1],
            [0, 2, 0, 1, 1, 1],
            [-1, 0, 0, -1, -1, 1],//d面
            [-1, 0, 0, 0, -1, 1],
            [-1, 0, 0, 1, -1, 1],
            [-1, 0, 0, -1, 0, 1],
            [-1, 0, 0, 0, 0, 1],
            [-1, 0, 0, 1, 0, 1],
            [-1, 0, 0, -1, 1, 1],
            [-1, 0, 0, 0, 1, 1],
            [-1, 0, 0, 1, 1, 1]
        ],
        arrowShow: [
            false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false],
        arrowDir: [0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0],
        angleY: -20,
        angleX: -15,
        touchX: 0,
        touchY: 0
    }
    componentDidMount(){
        this.props.onRef(this)
    }
    _openAnimation = () => {
        this.setState({
            aniState: true
        })
    }
    _closeAnimation = () => {
        this.setState({
            aniState: false
        })
    }

    setSpeed=(value:number)=>{
        this.setState({
            stepTime:value
        })
    }
    _updateColor = (value: String) => {
        let ct = JSON.parse(JSON.stringify(this.state.colors))
        switch (value) {//下面是动画播放完后，瞬间重置div的位置的同时，将颜色修正过去
            case 'U':
                [ct[5], ct[7], ct[3], ct[1]] = [ct[1], ct[5], ct[7], ct[3]];
                [ct[0], ct[2], ct[8], ct[6]] = [ct[6], ct[0], ct[2], ct[8]];
                [ct[9], ct[18], ct[27], ct[36]] = [ct[18], ct[27], ct[36], ct[9]];
                [ct[10], ct[19], ct[28], ct[37]] = [ct[19], ct[28], ct[37], ct[10]];
                [ct[11], ct[20], ct[29], ct[38]] = [ct[20], ct[29], ct[38], ct[11]];
                this.setState({
                    colors: ct
                })
                break;
            case 'U\'':
                [ct[1], ct[5], ct[7], ct[3]] = [ct[5], ct[7], ct[3], ct[1]];
                [ct[6], ct[0], ct[2], ct[8]] = [ct[0], ct[2], ct[8], ct[6]];
                [ct[18], ct[27], ct[36], ct[9]] = [ct[9], ct[18], ct[27], ct[36]];
                [ct[19], ct[28], ct[37], ct[10]] = [ct[10], ct[19], ct[28], ct[37]];
                [ct[20], ct[29], ct[38], ct[11]] = [ct[11], ct[20], ct[29], ct[38]];
                this.setState({
                    colors: ct
                })
                break;
            case 'U2':
                [ct[5], ct[7], ct[3], ct[1]] = [ct[3], ct[1], ct[5], ct[7]];
                [ct[0], ct[2], ct[8], ct[6]] = [ct[8], ct[6], ct[0], ct[2]];
                [ct[9], ct[18], ct[27], ct[36]] = [ct[27], ct[36], ct[9], ct[18]];
                [ct[10], ct[19], ct[28], ct[37]] = [ct[28], ct[37], ct[10], ct[19]];
                [ct[11], ct[20], ct[29], ct[38]] = [ct[29], ct[38], ct[11], ct[20]];
                this.setState({
                    colors: ct
                })
                break;
            case 'R':
                [ct[27], ct[29], ct[35], ct[33]] = [ct[33], ct[27], ct[29], ct[35]];
                [ct[28], ct[32], ct[34], ct[30]] = [ct[30], ct[28], ct[32], ct[34]];
                [ct[2], ct[42], ct[47], ct[20]] = [ct[20], ct[2], ct[42], ct[47]];
                [ct[5], ct[39], ct[50], ct[23]] = [ct[23], ct[5], ct[39], ct[50]];
                [ct[8], ct[36], ct[53], ct[26]] = [ct[26], ct[8], ct[36], ct[53]];
                this.setState({
                    colors: ct
                })
                break;
            case 'R\'':
                [ct[33], ct[27], ct[29], ct[35]] = [ct[27], ct[29], ct[35], ct[33]];
                [ct[30], ct[28], ct[32], ct[34]] = [ct[28], ct[32], ct[34], ct[30]];
                [ct[20], ct[2], ct[42], ct[47]] = [ct[2], ct[42], ct[47], ct[20]];
                [ct[23], ct[5], ct[39], ct[50]] = [ct[5], ct[39], ct[50], ct[23]];
                [ct[26], ct[8], ct[36], ct[53]] = [ct[8], ct[36], ct[53], ct[26]];
                this.setState({
                    colors: ct
                })
                break;
            case 'R2':
                [ct[27], ct[29], ct[35], ct[33]] = [ct[35], ct[33], ct[27], ct[29]];
                [ct[28], ct[32], ct[34], ct[30]] = [ct[34], ct[30], ct[28], ct[32]];
                [ct[2], ct[42], ct[47], ct[20]] = [ct[47], ct[20], ct[2], ct[42]];
                [ct[5], ct[39], ct[50], ct[23]] = [ct[50], ct[23], ct[5], ct[39]];
                [ct[8], ct[36], ct[53], ct[26]] = [ct[53], ct[26], ct[8], ct[36]];
                this.setState({
                    colors: ct
                })
                break;
            case 'F':
                [ct[18], ct[20], ct[26], ct[24]] = [ct[24], ct[18], ct[20], ct[26]];
                [ct[19], ct[23], ct[25], ct[21]] = [ct[21], ct[19], ct[23], ct[25]];
                [ct[6], ct[27], ct[47], ct[17]] = [ct[17], ct[6], ct[27], ct[47]];
                [ct[7], ct[30], ct[46], ct[14]] = [ct[14], ct[7], ct[30], ct[46]];
                [ct[8], ct[33], ct[45], ct[11]] = [ct[11], ct[8], ct[33], ct[45]];
                this.setState({
                    colors: ct
                })
                break;
            case 'F\'':
                [ct[24], ct[18], ct[20], ct[26]] = [ct[18], ct[20], ct[26], ct[24]];
                [ct[21], ct[19], ct[23], ct[25]] = [ct[19], ct[23], ct[25], ct[21]];
                [ct[17], ct[6], ct[27], ct[47]] = [ct[6], ct[27], ct[47], ct[17]];
                [ct[14], ct[7], ct[30], ct[46]] = [ct[7], ct[30], ct[46], ct[14]];
                [ct[11], ct[8], ct[33], ct[45]] = [ct[8], ct[33], ct[45], ct[11]];
                this.setState({
                    colors: ct
                })
                break;
            case 'F2':
                [ct[18], ct[20], ct[26], ct[24]] = [ct[26], ct[24], ct[18], ct[20]];
                [ct[19], ct[23], ct[25], ct[21]] = [ct[25], ct[21], ct[19], ct[23]];
                [ct[6], ct[27], ct[47], ct[17]] = [ct[47], ct[17], ct[6], ct[27]];
                [ct[7], ct[30], ct[46], ct[14]] = [ct[46], ct[14], ct[7], ct[30]];
                [ct[8], ct[33], ct[45], ct[11]] = [ct[45], ct[11], ct[8], ct[33]];
                this.setState({
                    colors: ct
                })
                break;
            case 'L':
                [ct[9], ct[11], ct[17], ct[15]] = [ct[15], ct[9], ct[11], ct[17]];
                [ct[10], ct[14], ct[16], ct[12]] = [ct[12], ct[10], ct[14], ct[16]];
                [ct[0], ct[18], ct[45], ct[44]] = [ct[44], ct[0], ct[18], ct[45]];
                [ct[3], ct[21], ct[48], ct[41]] = [ct[41], ct[3], ct[21], ct[48]];
                [ct[6], ct[24], ct[51], ct[38]] = [ct[38], ct[6], ct[24], ct[51]];
                this.setState({
                    colors: ct
                })
                break;
            case 'L\'':
                [ct[15], ct[9], ct[11], ct[17]] = [ct[9], ct[11], ct[17], ct[15]];
                [ct[12], ct[10], ct[14], ct[16]] = [ct[10], ct[14], ct[16], ct[12]];
                [ct[44], ct[0], ct[18], ct[45]] = [ct[0], ct[18], ct[45], ct[44]];
                [ct[41], ct[3], ct[21], ct[48]] = [ct[3], ct[21], ct[48], ct[41]];
                [ct[38], ct[6], ct[24], ct[51]] = [ct[6], ct[24], ct[51], ct[38]];
                this.setState({
                    colors: ct
                })
                break;
            case 'L2':
                [ct[9], ct[11], ct[17], ct[15]] = [ct[17], ct[15], ct[9], ct[11]];
                [ct[10], ct[14], ct[16], ct[12]] = [ct[16], ct[12], ct[10], ct[14]];
                [ct[0], ct[18], ct[45], ct[44]] = [ct[45], ct[44], ct[0], ct[18]];
                [ct[3], ct[21], ct[48], ct[41]] = [ct[48], ct[41], ct[3], ct[21]];
                [ct[6], ct[24], ct[51], ct[38]] = [ct[51], ct[38], ct[6], ct[24]];
                this.setState({
                    colors: ct
                })
                break;
            case 'B':
                [ct[36], ct[38], ct[44], ct[42]] = [ct[42], ct[36], ct[38], ct[44]];
                [ct[37], ct[41], ct[43], ct[39]] = [ct[39], ct[37], ct[41], ct[43]];
                [ct[2], ct[9], ct[51], ct[35]] = [ct[35], ct[2], ct[9], ct[51]];
                [ct[1], ct[12], ct[52], ct[32]] = [ct[32], ct[1], ct[12], ct[52]];
                [ct[0], ct[15], ct[53], ct[29]] = [ct[29], ct[0], ct[15], ct[53]];
                this.setState({
                    colors: ct
                })
                break;
            case 'B\'':
                [ct[42], ct[36], ct[38], ct[44]] = [ct[36], ct[38], ct[44], ct[42]];
                [ct[39], ct[37], ct[41], ct[43]] = [ct[37], ct[41], ct[43], ct[39]];
                [ct[35], ct[2], ct[9], ct[51]] = [ct[2], ct[9], ct[51], ct[35]];
                [ct[32], ct[1], ct[12], ct[52]] = [ct[1], ct[12], ct[52], ct[32]];
                [ct[29], ct[0], ct[15], ct[53]] = [ct[0], ct[15], ct[53], ct[29]];
                this.setState({
                    colors: ct
                })
                break;
            case 'B2':
                [ct[36], ct[38], ct[44], ct[42]] = [ct[44], ct[42], ct[36], ct[38]];
                [ct[37], ct[41], ct[43], ct[39]] = [ct[43], ct[39], ct[37], ct[41]];
                [ct[2], ct[9], ct[51], ct[35]] = [ct[51], ct[35], ct[2], ct[9]];
                [ct[1], ct[12], ct[52], ct[32]] = [ct[52], ct[32], ct[1], ct[12]];
                [ct[0], ct[15], ct[53], ct[29]] = [ct[53], ct[29], ct[0], ct[15]];
                this.setState({
                    colors: ct
                })
                break;
            case 'D':
                [ct[45], ct[47], ct[53], ct[51]] = [ct[51], ct[45], ct[47], ct[53]];
                [ct[46], ct[50], ct[52], ct[48]] = [ct[48], ct[46], ct[50], ct[52]];
                [ct[24], ct[33], ct[42], ct[15]] = [ct[15], ct[24], ct[33], ct[42]];
                [ct[25], ct[34], ct[43], ct[16]] = [ct[16], ct[25], ct[34], ct[43]];
                [ct[26], ct[35], ct[44], ct[17]] = [ct[17], ct[26], ct[35], ct[44]];
                this.setState({
                    colors: ct
                })
                break;
            case 'D\'':
                [ct[51], ct[45], ct[47], ct[53]] = [ct[45], ct[47], ct[53], ct[51]];
                [ct[48], ct[46], ct[50], ct[52]] = [ct[46], ct[50], ct[52], ct[48]];
                [ct[15], ct[24], ct[33], ct[42]] = [ct[24], ct[33], ct[42], ct[15]];
                [ct[16], ct[25], ct[34], ct[43]] = [ct[25], ct[34], ct[43], ct[16]];
                [ct[17], ct[26], ct[35], ct[44]] = [ct[26], ct[35], ct[44], ct[17]];
                this.setState({
                    colors: ct
                })
                break;
            case 'D2':
                [ct[45], ct[47], ct[53], ct[51]] = [ct[53], ct[51], ct[45], ct[47]];
                [ct[46], ct[50], ct[52], ct[48]] = [ct[52], ct[48], ct[46], ct[50]];
                [ct[24], ct[33], ct[42], ct[15]] = [ct[42], ct[15], ct[24], ct[33]];
                [ct[25], ct[34], ct[43], ct[16]] = [ct[43], ct[16], ct[25], ct[34]];
                [ct[26], ct[35], ct[44], ct[17]] = [ct[44], ct[17], ct[26], ct[35]];
                this.setState({
                    colors: ct
                })
                break;
        }
    }
    _resetTips = () => {
        this.setState({
            tipsData: [
                true, true, true, true, true, true, true, true, true,
                true, true, true, true, true, true, true, true, true,
                true, true, true, true, true, true, true, true, true,
                true, true, true, true, true, true, true, true, true,
                true, true, true, true, true, true, true, true, true,
                true, true, true, true, true, true, true, true, true],
            arrowShow: [
                false, false, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false, false]
        })
    }
    _rotate = (value: String) => {
        let temp = JSON.parse(JSON.stringify(this.state.positionData));
        let tips = [true, true, true, true, true, true, true, true, true,
            true, true, true, true, true, true, true, true, true,
            true, true, true, true, true, true, true, true, true,
            true, true, true, true, true, true, true, true, true,
            true, true, true, true, true, true, true, true, true,
            true, true, true, true, true, true, true, true, true]
        let arrowTips = [false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false]
        let arrowDir = [0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0]

        switch (value) {
            case 'U':
                if (this.state.openTips) {
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 18, 19, 20, 27, 28, 29, 36, 37, 38].forEach(i => {
                        tips[i] = false//哪些底色改变
                    });
                    [9, 10, 11, 18, 19, 20, 27, 28, 29, 36, 37, 38].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                        arrowDir[i] = -1//哪些箭头改变方向
                    })
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(i => {
                    temp[i][2] = temp[i][2] + 1//以上元素z旋转90
                });
                [9, 10, 11, 18, 19, 20, 27, 28, 29, 36, 37, 38].forEach(i => {
                    temp[i][1] = temp[i][1] - 1 //以上元素y旋转90
                });
                break;
            case 'U\'':
                if (this.state.openTips) {
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 18, 19, 20, 27, 28, 29, 36, 37, 38].forEach(i => {
                        tips[i] = false
                    });
                    [9, 10, 11, 18, 19, 20, 27, 28, 29, 36, 37, 38].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                        arrowDir[i] = 1//哪些箭头改变方向
                    })
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(i => {
                    temp[i][2] = temp[i][2] - 1//以上元素z旋转90
                });
                [9, 10, 11, 18, 19, 20, 27, 28, 29, 36, 37, 38].forEach(i => {
                    temp[i][1] = temp[i][1] + 1 //以上元素y旋转90
                });
                break;
            case 'U2':
                if (this.state.openTips) {
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 18, 19, 20, 27, 28, 29, 36, 37, 38].forEach(i => {
                        tips[i] = false
                    });
                    [9, 10, 11, 18, 19, 20, 27, 28, 29, 36, 37, 38].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                        arrowDir[i] = -1//哪些箭头改变方向
                    })
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(i => {
                    temp[i][2] = temp[i][2] + 2//以上元素z旋转90
                });
                [9, 10, 11, 18, 19, 20, 27, 28, 29, 36, 37, 38].forEach(i => {
                    temp[i][1] = temp[i][1] - 2 //以上元素y旋转90
                });
                break;
            case 'R':
                if (this.state.openTips) {
                    [27, 28, 29, 30, 31, 32, 33, 34, 35, 2, 5, 8, 20, 23, 26, 36, 39, 42, 47, 50, 53].forEach(i => {
                        tips[i] = false
                    });
                    [2, 5, 8, 20, 23, 26, 36, 39, 42, 47, 50, 53].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                    });
                    [2, 5, 8, 20, 23, 26, 47, 50, 53].forEach(i => {
                        arrowDir[i] = 0//哪些箭头改变方向
                    });
                    [36, 39, 42].forEach(i => {
                        arrowDir[i] = 2//哪些箭头改变方向
                    });
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [27, 28, 29, 30, 31, 32, 33, 34, 35].forEach(i => {
                    temp[i][2] = temp[i][2] + 1
                });
                [2, 5, 8, 20, 23, 26, 36, 39, 42, 47, 50, 53].forEach(i => {
                    temp[i][0] = temp[i][0] + 1
                });
                break;
            case 'R\'':
                if (this.state.openTips) {
                    [27, 28, 29, 30, 31, 32, 33, 34, 35, 2, 5, 8, 20, 23, 26, 36, 39, 42, 47, 50, 53].forEach(i => {
                        tips[i] = false
                    });
                    [2, 5, 8, 20, 23, 26, 36, 39, 42, 47, 50, 53].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                    });
                    [2, 5, 8, 20, 23, 26, 47, 50, 53].forEach(i => {
                        arrowDir[i] = 2//哪些箭头改变方向
                    });
                    [36, 39, 42].forEach(i => {
                        arrowDir[i] = 0//哪些箭头改变方向
                    });
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [27, 28, 29, 30, 31, 32, 33, 34, 35].forEach(i => {
                    temp[i][2] = temp[i][2] - 1
                });
                [2, 5, 8, 20, 23, 26, 36, 39, 42, 47, 50, 53].forEach(i => {
                    temp[i][0] = temp[i][0] - 1
                });
                break;
            case 'R2':
                if (this.state.openTips) {
                    [27, 28, 29, 30, 31, 32, 33, 34, 35, 2, 5, 8, 20, 23, 26, 36, 39, 42, 47, 50, 53].forEach(i => {
                        tips[i] = false
                    });
                    [2, 5, 8, 20, 23, 26, 36, 39, 42, 47, 50, 53].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                    });
                    [2, 5, 8, 20, 23, 26, 47, 50, 53].forEach(i => {
                        arrowDir[i] = 0//哪些箭头改变方向
                    });
                    [36, 39, 42].forEach(i => {
                        arrowDir[i] = 2//哪些箭头改变方向
                    });
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [27, 28, 29, 30, 31, 32, 33, 34, 35].forEach(i => {
                    temp[i][2] = temp[i][2] + 2
                });
                [2, 5, 8, 20, 23, 26, 36, 39, 42, 47, 50, 53].forEach(i => {
                    temp[i][0] = temp[i][0] + 2
                });
                break;
            case 'F':
                if (this.state.openTips) {
                    [18, 19, 20, 21, 22, 23, 24, 25, 26, 6, 7, 8, 11, 14, 17, 45, 46, 47, 27, 30, 33].forEach(i => {
                        tips[i] = false
                    });
                    [6, 7, 8, 11, 14, 17, 45, 46, 47, 27, 30, 33].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                    });
                    [6, 7, 8].forEach(i => {
                        arrowDir[i] = 1//哪些箭头改变方向
                    });
                    [27, 30, 33].forEach(i => {
                        arrowDir[i] = 2//哪些箭头改变方向
                    });
                    [11, 14, 17].forEach(i => {
                        arrowDir[i] = 0//哪些箭头改变方向
                    });
                    [45, 46, 47].forEach(i => {
                        arrowDir[i] = -1//哪些箭头改变方向
                    });
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [18, 19, 20, 21, 22, 23, 24, 25, 26].forEach(i => {
                    temp[i][2] = temp[i][2] + 1
                });
                [6, 7, 8].forEach(i => {
                    temp[i][1] = temp[i][1] + 1
                });
                [11, 14, 17].forEach(i => {
                    temp[i][0] = temp[i][0] + 1
                });
                [45, 46, 47].forEach(i => {
                    temp[i][1] = temp[i][1] - 1
                });
                [27, 30, 33].forEach(i => {
                    temp[i][0] = temp[i][0] - 1
                });
                break;
            case 'F\'':
                if (this.state.openTips) {
                    [18, 19, 20, 21, 22, 23, 24, 25, 26, 6, 7, 8, 11, 14, 17, 45, 46, 47, 27, 30, 33].forEach(i => {
                        tips[i] = false
                    });
                    [6, 7, 8, 11, 14, 17, 45, 46, 47, 27, 30, 33].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                    });
                    [6, 7, 8].forEach(i => {
                        arrowDir[i] = -1//哪些箭头改变方向
                    });
                    [27, 30, 33].forEach(i => {
                        arrowDir[i] = 0//哪些箭头改变方向
                    });
                    [11, 14, 17].forEach(i => {
                        arrowDir[i] = 2//哪些箭头改变方向
                    });
                    [45, 46, 47].forEach(i => {
                        arrowDir[i] = 1//哪些箭头改变方向
                    });
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [18, 19, 20, 21, 22, 23, 24, 25, 26].forEach(i => {
                    temp[i][2] = temp[i][2] - 1
                });
                [6, 7, 8].forEach(i => {
                    temp[i][1] = temp[i][1] - 1
                });
                [11, 14, 17].forEach(i => {
                    temp[i][0] = temp[i][0] - 1
                });
                [45, 46, 47].forEach(i => {
                    temp[i][1] = temp[i][1] + 1
                });
                [27, 30, 33].forEach(i => {
                    temp[i][0] = temp[i][0] + 1
                });
                break;
            case 'F2':
                if (this.state.openTips) {
                    [18, 19, 20, 21, 22, 23, 24, 25, 26, 6, 7, 8, 11, 14, 17, 45, 46, 47, 27, 30, 33].forEach(i => {
                        tips[i] = false
                    });
                    [6, 7, 8, 11, 14, 17, 45, 46, 47, 27, 30, 33].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                    });
                    [6, 7, 8].forEach(i => {
                        arrowDir[i] = 1//哪些箭头改变方向
                    });
                    [27, 30, 33].forEach(i => {
                        arrowDir[i] = 2//哪些箭头改变方向
                    });
                    [11, 14, 17].forEach(i => {
                        arrowDir[i] = 0//哪些箭头改变方向
                    });
                    [45, 46, 47].forEach(i => {
                        arrowDir[i] = -1//哪些箭头改变方向
                    });
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [18, 19, 20, 21, 22, 23, 24, 25, 26].forEach(i => {
                    temp[i][2] = temp[i][2] + 2
                });
                [6, 7, 8].forEach(i => {
                    temp[i][1] = temp[i][1] + 2
                });
                [11, 14, 17].forEach(i => {
                    temp[i][0] = temp[i][0] + 2
                });
                [45, 46, 47].forEach(i => {
                    temp[i][1] = temp[i][1] - 2
                });
                [27, 30, 33].forEach(i => {
                    temp[i][0] = temp[i][0] - 2
                });
                break;
            case 'L':
                if (this.state.openTips) {
                    [9, 10, 11, 12, 13, 14, 15, 16, 17, 0, 3, 6, 18, 21, 24, 38, 41, 44, 45, 48, 51].forEach(i => {
                        tips[i] = false
                    });
                    [0, 3, 6, 18, 21, 24, 38, 41, 44, 45, 48, 51].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                    });
                    [0, 3, 6, 18, 21, 24, 45, 48, 51].forEach(i => {
                        arrowDir[i] = 2//哪些箭头改变方向
                    });
                    [38, 41, 44].forEach(i => {
                        arrowDir[i] = 0//哪些箭头改变方向
                    });
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [9, 10, 11, 12, 13, 14, 15, 16, 17].forEach(i => {
                    temp[i][2] = temp[i][2] + 1
                });
                [0, 3, 6, 18, 21, 24, 38, 41, 44, 45, 48, 51].forEach(i => {
                    temp[i][0] = temp[i][0] - 1
                });
                break;
            case 'L\'':
                if (this.state.openTips) {
                    [9, 10, 11, 12, 13, 14, 15, 16, 17, 0, 3, 6, 18, 21, 24, 38, 41, 44, 45, 48, 51].forEach(i => {
                        tips[i] = false
                    });
                    [0, 3, 6, 18, 21, 24, 38, 41, 44, 45, 48, 51].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                    });
                    [0, 3, 6, 18, 21, 24, 45, 48, 51].forEach(i => {
                        arrowDir[i] = 0//哪些箭头改变方向
                    });
                    [38, 41, 44].forEach(i => {
                        arrowDir[i] = 2//哪些箭头改变方向
                    });
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [9, 10, 11, 12, 13, 14, 15, 16, 17].forEach(i => {
                    temp[i][2] = temp[i][2] - 1
                });
                [0, 3, 6, 18, 21, 24, 38, 41, 44, 45, 48, 51].forEach(i => {
                    temp[i][0] = temp[i][0] + 1
                });
                break;
            case 'L2':
                if (this.state.openTips) {
                    [9, 10, 11, 12, 13, 14, 15, 16, 17, 0, 3, 6, 18, 21, 24, 38, 41, 44, 45, 48, 51].forEach(i => {
                        tips[i] = false
                    });
                    [0, 3, 6, 18, 21, 24, 38, 41, 44, 45, 48, 51].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                    });
                    [0, 3, 6, 18, 21, 24, 45, 48, 51].forEach(i => {
                        arrowDir[i] = 2//哪些箭头改变方向
                    });
                    [38, 41, 44].forEach(i => {
                        arrowDir[i] = 0//哪些箭头改变方向
                    });
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [9, 10, 11, 12, 13, 14, 15, 16, 17].forEach(i => {
                    temp[i][2] = temp[i][2] + 2
                });
                [0, 3, 6, 18, 21, 24, 38, 41, 44, 45, 48, 51].forEach(i => {
                    temp[i][0] = temp[i][0] - 2
                });
                break;
            case 'B':
                if (this.state.openTips) {
                    [36, 37, 38, 39, 40, 41, 42, 43, 44, 0, 1, 2, 9, 12, 15, 51, 52, 53, 29, 32, 35].forEach(i => {
                        tips[i] = false
                    });
                    [0, 1, 2, 9, 12, 15, 51, 52, 53, 29, 32, 35].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                    });
                    [0, 1, 2].forEach(i => {
                        arrowDir[i] = -1//哪些箭头改变方向
                    });
                    [9, 12, 15].forEach(i => {
                        arrowDir[i] = 2//哪些箭头改变方向
                    });
                    [51, 52, 53].forEach(i => {
                        arrowDir[i] = 1//哪些箭头改变方向
                    });
                    [29, 32, 35].forEach(i => {
                        arrowDir[i] = 0//哪些箭头改变方向
                    });
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [36, 37, 38, 39, 40, 41, 42, 43, 44].forEach(i => {
                    temp[i][2] = temp[i][2] + 1
                });
                [0, 1, 2].forEach(i => {
                    temp[i][1] = temp[i][1] - 1
                });
                [9, 12, 15].forEach(i => {
                    temp[i][0] = temp[i][0] - 1
                });
                [51, 52, 53].forEach(i => {
                    temp[i][1] = temp[i][1] + 1
                });
                [29, 32, 35].forEach(i => {
                    temp[i][0] = temp[i][0] + 1
                });
                break;
            case 'B\'':
                if (this.state.openTips) {
                    [36, 37, 38, 39, 40, 41, 42, 43, 44, 0, 1, 2, 9, 12, 15, 51, 52, 53, 29, 32, 35].forEach(i => {
                        tips[i] = false
                    });
                    [0, 1, 2, 9, 12, 15, 51, 52, 53, 29, 32, 35].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                    });
                    [0, 1, 2].forEach(i => {
                        arrowDir[i] = 1//哪些箭头改变方向
                    });
                    [9, 12, 15].forEach(i => {
                        arrowDir[i] = 0//哪些箭头改变方向
                    });
                    [51, 52, 53].forEach(i => {
                        arrowDir[i] = -1//哪些箭头改变方向
                    });
                    [29, 32, 35].forEach(i => {
                        arrowDir[i] = 2//哪些箭头改变方向
                    });
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [36, 37, 38, 39, 40, 41, 42, 43, 44].forEach(i => {
                    temp[i][2] = temp[i][2] - 1
                });
                [0, 1, 2].forEach(i => {
                    temp[i][1] = temp[i][1] + 1
                });
                [9, 12, 15].forEach(i => {
                    temp[i][0] = temp[i][0] + 1
                });
                [51, 52, 53].forEach(i => {
                    temp[i][1] = temp[i][1] - 1
                });
                [29, 32, 35].forEach(i => {
                    temp[i][0] = temp[i][0] - 1
                });
                break;
            case 'B2':
                if (this.state.openTips) {
                    [36, 37, 38, 39, 40, 41, 42, 43, 44, 0, 1, 2, 9, 12, 15, 51, 52, 53, 29, 32, 35].forEach(i => {
                        tips[i] = false
                    });
                    [0, 1, 2, 9, 12, 15, 51, 52, 53, 29, 32, 35].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                    });
                    [0, 1, 2].forEach(i => {
                        arrowDir[i] = -1//哪些箭头改变方向
                    });
                    [9, 12, 15].forEach(i => {
                        arrowDir[i] = 2//哪些箭头改变方向
                    });
                    [51, 52, 53].forEach(i => {
                        arrowDir[i] = 1//哪些箭头改变方向
                    });
                    [29, 32, 35].forEach(i => {
                        arrowDir[i] = 0//哪些箭头改变方向
                    });
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [36, 37, 38, 39, 40, 41, 42, 43, 44].forEach(i => {
                    temp[i][2] = temp[i][2] + 2
                });
                [0, 1, 2].forEach(i => {
                    temp[i][1] = temp[i][1] - 2
                });
                [9, 12, 15].forEach(i => {
                    temp[i][0] = temp[i][0] - 2
                });
                [51, 52, 53].forEach(i => {
                    temp[i][1] = temp[i][1] + 2
                });
                [29, 32, 35].forEach(i => {
                    temp[i][0] = temp[i][0] + 2
                });
                break;
            case 'D':
                if (this.state.openTips) {
                    [45, 46, 47, 48, 49, 50, 51, 52, 53, 24, 25, 26, 33, 34, 35, 42, 43, 44, 15, 16, 17].forEach(i => {
                        tips[i] = false
                    });
                    [24, 25, 26, 33, 34, 35, 42, 43, 44, 15, 16, 17].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                        arrowDir[i] = 1//哪些箭头改变方向
                    })
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [45, 46, 47, 48, 49, 50, 51, 52, 53].forEach(i => {
                    temp[i][2] = temp[i][2] + 1
                });
                [24, 25, 26, 33, 34, 35, 42, 43, 44, 15, 16, 17].forEach(i => {
                    temp[i][1] = temp[i][1] + 1
                })
                break;
            case 'D\'':
                if (this.state.openTips) {
                    [45, 46, 47, 48, 49, 50, 51, 52, 53, 24, 25, 26, 33, 34, 35, 42, 43, 44, 15, 16, 17].forEach(i => {
                        tips[i] = false
                    });
                    [24, 25, 26, 33, 34, 35, 42, 43, 44, 15, 16, 17].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                        arrowDir[i] = -1//哪些箭头改变方向
                    })
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [45, 46, 47, 48, 49, 50, 51, 52, 53].forEach(i => {
                    temp[i][2] = temp[i][2] - 1
                });
                [24, 25, 26, 33, 34, 35, 42, 43, 44, 15, 16, 17].forEach(i => {
                    temp[i][1] = temp[i][1] - 1
                })
                break;
            case 'D2':
                if (this.state.openTips) {
                    [45, 46, 47, 48, 49, 50, 51, 52, 53, 24, 25, 26, 33, 34, 35, 42, 43, 44, 15, 16, 17].forEach(i => {
                        tips[i] = false
                    });
                    [24, 25, 26, 33, 34, 35, 42, 43, 44, 15, 16, 17].forEach(i => {
                        arrowTips[i] = true//哪些箭头开启
                        arrowDir[i] = 1//哪些箭头改变方向
                    })
                    this.setState({
                        arrowShow: arrowTips as Array<boolean>,
                        tipsData: tips,
                        arrowDir: arrowDir
                    })
                }
                [45, 46, 47, 48, 49, 50, 51, 52, 53].forEach(i => {
                    temp[i][2] = temp[i][2] + 2
                });
                [24, 25, 26, 33, 34, 35, 42, 43, 44, 15, 16, 17].forEach(i => {
                    temp[i][1] = temp[i][1] + 2
                })
                break;

        }

        this._openAnimation()
        this.setState({
            positionData: temp,
        })
        setTimeout(() => {
            this._closeAnimation()
            if (this.state.openTips) {
                this._resetTips()
            }
            this._updateColor(value)
            this._resetPosition()
        }, this.state.stepTime * 800);
    }
    rotate = (value: string) => {
        let queue=['']
        if(value.length>1){
            queue = value.split(' ')
        }else{
            queue = [value]
        }
        console.log(queue)
        let roll = () => {
            if (queue.length === 0) {
                    console.log('guanbidonghua')
                    this.setState({
                        openTips:false
                    })
                return
            }
            this._rotate(queue.shift() as string)
            setTimeout(() => {
                roll()
            }, 1000 * this.state.stepTime);
        }
        roll()
    }
    setColor = (value:Array<number>)=>{
        this.setState({
            colors:value
        })
    }
    resetColor = ()=>{
        this.setState({
            colors: [
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                1, 1, 1, 1, 1, 1, 1, 1, 1,
                2, 2, 2, 2, 2, 2, 2, 2, 2,
                3, 3, 3, 3, 3, 3, 3, 3, 3,
                4, 4, 4, 4, 4, 4, 4, 4, 4,
                5, 5, 5, 5, 5, 5, 5, 5, 5
            ]
        })
    }
    rotateWithTips =(value:string) =>{
        console.log('kaiqidonghua')
        this.setState({
            openTips:true
        },()=>{
            this.rotate(value)
        })
        
    }
    
    
    handleTouchStart = (e: any) => {
        let nowX = e.touches[0].clientX
        let nowY = e.touches[0].clientY
        this.setState(() => {
            return {
                touchX: nowX,
                touchY: nowY,
            }
        })
    }
    handleTouchMove = (e: any) => {
        if (((new Date() as any) - (this.time as any)) < 50) {
            return
        }
        let nowX = e.touches[0].clientX
        let changeX = (nowX - this.state.touchX) * 0.2
        let nowY = e.touches[0].clientY
        let changeY = (nowY - this.state.touchY) * -0.2
        if (Math.abs(changeX) > Math.abs(changeY)) {
            this.setState((prevState: any) => {
                return {
                    angleY: prevState.angleY + changeX,
                    touchX: nowX,
                    touchY: nowY
                }
            })
        } else {
            this.setState((prevState: any) => {
                return {
                    angleX: prevState.angleX + changeY,
                    touchX: nowX,
                    touchY: nowY
                }
            })
        }
        
        this.time = new Date()
    }
    _resetPosition = () => {
        this.setState(
            {
                positionData: [
                    [1, 0, 0, -1, -1, 1],//u面
                    [1, 0, 0, 0, -1, 1],
                    [1, 0, 0, 1, -1, 1],
                    [1, 0, 0, -1, 0, 1],
                    [1, 0, 0, 0, 0, 1],
                    [1, 0, 0, 1, 0, 1],
                    [1, 0, 0, -1, 1, 1],
                    [1, 0, 0, 0, 1, 1],
                    [1, 0, 0, 1, 1, 1],
                    [0, -1, 0, -1, -1, 1],//l面
                    [0, -1, 0, 0, -1, 1],
                    [0, -1, 0, 1, -1, 1],
                    [0, -1, 0, -1, 0, 1],
                    [0, -1, 0, 0, 0, 1],
                    [0, -1, 0, 1, 0, 1],
                    [0, -1, 0, -1, 1, 1],
                    [0, -1, 0, 0, 1, 1],
                    [0, -1, 0, 1, 1, 1],
                    [0, 0, 0, -1, -1, 1],//f面
                    [0, 0, 0, 0, -1, 1],
                    [0, 0, 0, 1, -1, 1],
                    [0, 0, 0, -1, 0, 1],
                    [0, 0, 0, 0, 0, 1],
                    [0, 0, 0, 1, 0, 1],
                    [0, 0, 0, -1, 1, 1],
                    [0, 0, 0, 0, 1, 1],
                    [0, 0, 0, 1, 1, 1],
                    [0, 1, 0, -1, -1, 1],//r面
                    [0, 1, 0, 0, -1, 1],
                    [0, 1, 0, 1, -1, 1],
                    [0, 1, 0, -1, 0, 1],
                    [0, 1, 0, 0, 0, 1],
                    [0, 1, 0, 1, 0, 1],
                    [0, 1, 0, -1, 1, 1],
                    [0, 1, 0, 0, 1, 1],
                    [0, 1, 0, 1, 1, 1],
                    [0, 2, 0, -1, -1, 1],//b面
                    [0, 2, 0, 0, -1, 1],
                    [0, 2, 0, 1, -1, 1],
                    [0, 2, 0, -1, 0, 1],
                    [0, 2, 0, 0, 0, 1],
                    [0, 2, 0, 1, 0, 1],
                    [0, 2, 0, -1, 1, 1],
                    [0, 2, 0, 0, 1, 1],
                    [0, 2, 0, 1, 1, 1],
                    [-1, 0, 0, -1, -1, 1],//d面
                    [-1, 0, 0, 0, -1, 1],
                    [-1, 0, 0, 1, -1, 1],
                    [-1, 0, 0, -1, 0, 1],
                    [-1, 0, 0, 0, 0, 1],
                    [-1, 0, 0, 1, 0, 1],
                    [-1, 0, 0, -1, 1, 1],
                    [-1, 0, 0, 0, 1, 1],
                    [-1, 0, 0, 1, 1, 1]
                ]
            })
    }

    render() {
        return (
            <div onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove} style={{
                perspective: '1300px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                touchAction: 'none',
                height:this.props.height?this.props.height:'450px',
                width:this.props.width?this.props.width:'450px'

            }}>
                <div style={{
                        transformStyle: 'preserve-3d',
                        height: '100px',
                        width: '100px',
                        transform: `rotateX(${this.state.angleX}deg)`,
                        transition: `transform 0.05s linear`,
                        position: 'relative',

                    }}>
                    <div style={{
                        transformStyle: 'preserve-3d',
                        height: '100px',
                        width: '100px',
                        transform: `rotateY(${this.state.angleY}deg)`,
                        transition: `transform 0.05s linear`,
                        position: 'relative',

                    }}>
                        {this.state.colors.map((color, index) => {
                            return (<div key={index} style={{
                                width: this.state.size * 100 + 'px',
                                height: this.state.size * 100 + 'px',
                                position: 'absolute',
                                top: '0',
                                bottom: '0',
                                left: '0',
                                right: '0',
                                margin: 'auto',
                                backgroundColor: this.state.tipsData[index] ? 'black' : '#aaa',
                                transformStyle: 'preserve-3d',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                transition: this.state.aniState ? `transform ${this.state.stepTime * 0.8}s linear, background-color 0.2s linear` : 'background-color 0.2s linear',
                                backfaceVisibility: 'unset',
                                transform: ((index > 8 && index < 18) || (index > 26 && index < 36)) ?
                                    `
                            rotateY(${this.state.positionData[index][1] * 90}deg) 
                            rotateX(${this.state.positionData[index][0] * 90}deg) 
                            rotateZ(${this.state.positionData[index][2] * 90}deg) 
                            translateX(${this.state.positionData[index][3] * 100 * this.state.size}px) 
                            translateY(${this.state.positionData[index][4] * 100 * this.state.size}px) 
                            translateZ(${this.state.positionData[index][5] * 150 * this.state.size}px) 
                            `:
                                    `
                            rotateX(${this.state.positionData[index][0] * 90}deg) 
                            rotateY(${this.state.positionData[index][1] * 90}deg) 
                            rotateZ(${this.state.positionData[index][2] * 90}deg) 
                            translateX(${this.state.positionData[index][3] * 100 * this.state.size}px) 
                            translateY(${this.state.positionData[index][4] * 100 * this.state.size}px) 
                            translateZ(${this.state.positionData[index][5] * 150 * this.state.size}px) 
                        `
                            }}><div style={{
                                height: this.state.size * 80 + 'px',
                                width: this.state.size * 80 + 'px',
                                backgroundColor: Color[color],
                                borderRadius: this.state.size * 5 + 'px',
                            }}></div>
                                <div className='one-arrow' style={{
                                    height: this.state.size * 100 + 'px',
                                    width: this.state.size * 100 + 'px',
                                    position: 'absolute',
                                    transform: `rotateZ(${this.state.arrowDir[index] * 90}deg)`
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        height: 0,
                                        width: 0,
                                        top: `${this.state.size * 30}px`,
                                        left: `${this.state.size * 30}px`,
                                        borderBottom: this.state.arrowShow[index] ? `${this.state.size * 20}px black solid` : `${this.state.size * 20}px transparent solid`,
                                        borderLeft: `${this.state.size * 20}px transparent solid`,
                                        borderRight: `${this.state.size * 20}px transparent solid`,

                                    }}></div>
                                    <div style={{
                                        position: 'absolute',
                                        height: `${this.state.size * 20}px`,
                                        width: `${this.state.size * 18}px`,
                                        top: `${this.state.size * 50}px`,
                                        left: `${this.state.size * 41}px`,
                                        backgroundColor: this.state.arrowShow[index] ? 'black' : 'transparent',

                                    }}></div>
                                </div>
                                <div style={{
                                    height: this.state.size * 100 + 'px',
                                    width: this.state.size * 100 + 'px',
                                    backgroundColor: 'black',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: -1,
                                    transform: 'translateZ(-1px)',
                                }}></div>

                            </div>)
                        })}

                    </div>
                </div>

            </div>
        )
    }
}

export default Cube