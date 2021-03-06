﻿/**
 * Description:  该插件用于实现MCU分屏功能，并提供双击放大、拖拽交换、视频文字显示等功能
 * Dependency：  jquery-1.10.2.js  jquery-ui-1.10.1.min.js
 * Author：      wchi
 * Date：        2015.10.16
 */

//下面的方法用于字符串格式化
if (!String.format) {
    String.format = function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

//判断字符串是否为空
function IsStringEmpty(str) {
    if(str && str!='')
        return false;
    else
        return true;
}

var VideoMCU = function () {
    //用于保存分屏结构的table名称
    var VIDEO_TABLE_NAME = "VideoTable";

    //用于让video标签规矩显示，不会把父容器给撑开
    var VIDEO_DIV_FORMAT = "<div id='{0}' style='border:0 black solid;width:100%;height:100%;position:relative'>\
				<div id='{1}' style='text-align:center;border:0 black solid;width:100%;height:100%;position:absolute;overflow: hidden;'>\
				{2}\
				</div>\
			</div>";

    //该标签用于显示无视频时的默认图片
    var DEFAULT_IMG_DIV_FORMAT = "<div style='border:0 black solid;width:100%;height:100%;position:relative'>\
				<div style='border:0 black solid;width:100%;height:100%;position:absolute;overflow: hidden;'>\
				<img style='display:block;width:100%;' src='{0}'/>\
				</div>\
			</div>";

    //该标签用于定义在视频上面显示的文字样式
    var VIDEO_TEXT_DIV_FORMAT = "<div style='font-family:黑体;color:#FFF;position:absolute;top:7%;right:5%'>{0}</div>";

    //该标签用于定义视频上面显示的静音图标
    var VIDEO_MUTE_IMG = "<input id='{0}'type='image' src='mute_image/Mute_Button_On.png' class='mute_image'/>"

    /******************************************************************************************************/
    /*表格布局样式，用于视频分屏*/
    /******************************************************************************************************/
    var VIDEO_SPLIT_LAYOUT1 = "<table id='VideoTable' style='margin:0;border-spacing:0;' width='100%' height='100%' align='center'>\
	<tbody>\
	<tr><td align='center'></td></tr>\
	</tbody>\
	</table>";

    var VIDEO_SPLIT_LAYOUT2 = "<table id='VideoTable' style='margin:0;border-spacing:0;' width='100%' height='100%' align='center'>\
	<tbody>\
		<tr>\
			<td align='center' style='display:none;'></td>\
			<td align='center'></td>\
		</tr>\
	</tbody>\
</table>";

    var VIDEO_SPLIT_LAYOUT3 = "<table id='VideoTable' style='margin:0;border-spacing:0;' width='100%' height='100%' align='center'>\
	<tbody>\
		<tr>\
			<td colspan='2' align='center' heigth='50%'></td>\
		</tr>\
		<tr>\
			<td align='center' width='50%' height='50%'></td>\
			<td align='center' width='50%' height='50%'></td>\
		</tr>\
	</tbody>\
</table>";

    var VIDEO_SPLIT_LAYOUT4 = "<table id='VideoTable' style='margin:0;border-spacing:0;' width='100%' height='100%' align='center'>\
	<tbody>\
		<tr>\
			<td align='center' width='50%' height='50%'></td>\
			<td align='center' width='50%' height='50%'></td>\
		</tr>\
		<tr>\
			<td align='center' width='50%' height='50%'></td>\
			<td align='center' width='50%' height='50%'></td>\
		</tr>\
	</tbody>\
</table>";

    var VIDEO_SPLIT_LAYOUT5 = "<table id='VideoTable' style='margin:0;border-spacing:0;' width='100%' height='100%' align='center'>\
	<tbody>\
		<tr>\
			<td colspan='4' align='center' width='100%' height='70%'></td>\
		</tr>\
		<tr>\
			<td align='center' width='25%' height='30%'></td>\
			<td align='center' width='25%' height='30%'></td>\
			<td align='center' width='25%' height='30%'></td>\
			<td align='center' width='25%' height='30%'></td>\
		</tr>\
	</tbody>\
</table>";

    var VIDEO_SPLIT_LAYOUT6 = "<table id='VideoTable' style='margin:0;border-spacing:0;' width='100%' height='100%' align='center'>\
	<tbody>\
		<tr>\
			<td colspan='2' rowspan='2' align='center' width='66.7%' height='66.7%'></td>\
			<td align='center' width='33.3%' height='33.3%'></td>\
		</tr>\
		<tr>\
			<td align='center' width='33.3%' height='33.3%'></td>\
		</tr>\
		<tr>\
			<td align='center' width='33.3%' height='33.3%'></td>\
			<td align='center' width='33.3%' height='33.3%'></td>\
			<td align='center' width='33.3%' height='33.3%'></td>\
		</tr>\
	</tbody>\
</table>";

    var VIDEO_SPLIT_LAYOUT7 = "<table id='VideoTable' style='margin:0;border-spacing:0;' width='100%' height='100%' align='center'>\
    <tbody>\
        <tr>\
            <td colspan='2' width='50%' height='50%' align='center'></td>\
            <td colspan='2' width='50%' height='50%' align='center'></td>\
        </tr>\
        <tr>\
            <td width='50%' colspan='2' rowspan='2' width='50%' height='50%' align='center'></td>\
            <td width='25%' height='20%' align='center'></td>\
            <td width='25%' height='20%' align='center'></td>\
        </tr>\
        <tr>\
            <td width='25%' height='20%' align='center'></td>\
            <td width='25%' height='20%' align='center'></td>\
        </tr>\
    </tbody>\
</table>";

    var VIDEO_SPLIT_LAYOUT8 = "<table id='VideoTable' style='margin:0;border-spacing:0;' width='100%' height='100%' align='center'>\
    <tbody>\
        <tr>\
            <td colspan='3' rowspan='3' width='75%' height='75%' align='center'></td>\
            <td align='center' width='25%' height='25%'></td>\
        </tr>\
        <tr>\
            <td align='center' width='25%' height='25%'></td>\
        </tr>\
        <tr>\
            <td align='center' width='25%' height='25%'></td>\
        </tr>\
        <tr>\
            <td align='center' width='25%' height='25%'></td>\
            <td align='center' width='25%' height='25%'></td>\
            <td align='center' width='25%' height='25%'></td>\
            <td align='center' width='25%' height='25%'></td>\
        </tr>\
    </tbody>\
</table>";

    var VIDEO_SPLIT_LAYOUT9 = "<table id='VideoTable' style='margin:0;border-spacing:0;' width='100%' height='100%' align='center'>\
    <tbody>\
        <tr>\
            <td align='center' width='33.3%' height='33.3%'></td>\
            <td align='center' width='33.3%' height='33.3%'></td>\
            <td align='center' width='33.3%' height='33.3%'></td>\
        </tr>\
        <tr>\
            <td align='center' width='33.3%' height='33.3%'></td>\
            <td align='center' width='33.3%' height='33.3%'></td>\
            <td align='center' width='33.3%' height='33.3%'></td>\
        </tr>\
        <tr>\
            <td align='center' width='33.3%' height='33.3%'></td>\
            <td align='center' width='33.3%' height='33.3%'></td>\
            <td align='center' width='33.3%' height='33.3%'></td>\
        </tr>\
    </tbody>\
</table>";

    var VIDEO_SPLIT_LAYOUT10 = "<table id='VideoTable' style='margin:0;border-spacing:0;' width='100%' height='100%' align='center'>\
    <tbody>\
        <tr>\
            <td colspan='2' width='50%' height='50%'  align='center'></td>\
            <td colspan='2' width='50%' height='50%'  align='center'></td>\
        </tr>\
        <tr>\
            <td width='25%' height='25%' align='center'></td>\
            <td width='25%' height='25%' align='center'></td>\
            <td width='25%' height='25%' align='center'></td>\
            <td width='25%' height='25%' align='center'></td>\
        </tr>\
        <tr>\
            <td width='25%' height='25%' align='center'></td>\
            <td width='25%' height='25%' align='center'></td>\
            <td width='25%' height='25%' align='center'></td>\
            <td width='25%' height='25%' align='center'></td>\
        </tr>\
    </tbody>\
</table>";

    var VIDEO_SPLIT_LAYOUT13 = "<table id='VideoTable' style='margin:0;border-spacing:0;' width='100%' height='100%' align='center'>\
    <tbody>\
        <tr>\
            <td height='50%' width='50%' colspan='2' rowspan='2' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
        </tr>\
        <tr>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
        </tr>\
        <tr>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
        </tr>\
        <tr>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
        </tr>\
    </tbody>\
</table>";

    var VIDEO_SPLIT_LAYOUT16 = "<table id='VideoTable' style='margin:0;border-spacing:0;' width='100%' height='100%' align='center'>\
    <tbody>\
        <tr>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
        </tr>\
        <tr>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
        </tr>\
        <tr>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
        </tr>\
        <tr>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
            <td height='25%' width='25%' align='center'></td>\
        </tr>\
    </tbody>\
</table>";


    function videomcu() {
        //无视频时显示的默认图片全路径
        this.defaultImgPath = "defaultConf.bmp";

        //页面中用于存放视频的容器id，如某一个div的id
        this.videoContainerId = "";

        //该列表用于保存视频用户信息，包括id、姓名、视频URL等
        this.currVideoUsers = [];
        //当前分屏数量
        this.currScreenSplitNum = 0;

        //当前本地用户的userId
        this.localVideoUserId = "";

        /**
         * 获取分屏布局的html
         * @param screenCount   分屏的数量
         * @returns {Object}
         */
        this.getSplitHTML = function (screenCount) {
            var id = 'VIDEO_SPLIT_LAYOUT' + screenCount;
            return eval(id);
        };

        /**
         * 获取无视频时显示的默认图片div
         */
        this.getDefaultImgDiv = function(){
            return String.format(DEFAULT_IMG_DIV_FORMAT, this.defaultImgPath);
        };

        /**
         * 将视频附加到页面表格中
         * @param videoTagList  包含所有视频标签
         * @param tableName     需要附加视频的表格名称
         */
        this.attachVideoToTable = function (videoTagList, tableName) {
            var tds = document.getElementById(tableName).getElementsByTagName("TD");

            var videoTag;
            for (var i = 0; i < tds.length; i++) {
                videoTag = videoTagList[i + 1];
                if (videoTag != null) {
                    tds[i].innerHTML = videoTagList[i + 1];
                } else {
                    tds[i].innerHTML = this.getDefaultImgDiv();
                }
            }
        };

        /**
         * 根据用户信息，构建video标签，并在外面套上一层div，以便控制
         * @param userInfo  用户基本分屏信息
         */
        this.buildVideoTag = function (userInfo) {
            var videoStyle = "position: relative; width:100%;height:auto;";
            var videoId = "video-" + userInfo.userId;
            //noinspection HtmlUnknownTarget
            var videoTag = String.format("<video id='{0}' autoplay='true' src='{1}' style='{2}'></video>",
                videoId, userInfo.videoURL, videoStyle);// muted='muted'

            if(!IsStringEmpty(userInfo.userName)) {
                videoTag = this.addVideoText(videoTag, userInfo.userName);
            }
            videoTag = this.addMuteImg(videoTag,userInfo.userId);
            return String.format(VIDEO_DIV_FORMAT, "div1_" + userInfo.userId, "div2_" + userInfo.userId, videoTag);
        };

        /**
         * 在视频上面增加文字显示
         * @param videoTag  绑定好用户视频的video标签
         * @param userName  在视频上面显示的用户名称
         */
        this.addVideoText = function (videoTag, userName) {
            var txtDiv = String.format(VIDEO_TEXT_DIV_FORMAT, userName);
            return videoTag + txtDiv;
        };

        /**
         * 在视频上面添加静音图标
         * @param videoTag  视频标签
         * @param userId    用户id
         *
         * */
        this.addMuteImg = function (videoTag, userId){
            var img = String.format(VIDEO_MUTE_IMG,'mute_img_'+userId);
            return videoTag + img;
        };



        /**
         * 将video tag根据videoPostion保存到数组的相应位置。便于后面直接根据数组位置展现视频
         * 如果videoPostion为空，则从数组起始位置开始放置
         *  @param videoTagList 视频标签列表
         * @param videoTag  视频标签
         * @param videoPosition 视频分屏位置
         */
        this.addVideoTag = function (videoTagList, videoTag, videoPosition) {
            //如果指定videoPosition，则保存到指定位置
            if (videoPosition > 0) {
                videoTagList[videoPosition] = videoTag;
            } else {
                //未指定视频位置，则从1开始放
                for (var i = 1; i < videoTagList.length; i++) {
                    //找到一个空的位置，存入videotag
                    if (videoTagList[i] == null) {
                        videoTagList[i] = videoTag;
                        break;
                    }
                }
            }
        };

        /**
         * 对用户列表的视频位置进行重新编号,从1开始编号（在自动分屏时用到）
         * @param userInfos
         */
        this.reIndexUsers = function(userInfos){
            //对剩余视频用户进行重新编号
            for(var i=0;i<userInfos.length;i++){
                userInfos[i].videoPosition = i+1;
            }

            return userInfos;
        };

        /**
         * 判断用户是否处于MCU视频列表中
         * @param userId    用户id
         */
        this.isUserExists = function(userId){
            for(var i=0;i<this.currVideoUsers.length;i++){
                if(this.currVideoUsers[i].userId == userId){
                    return true;
                }
            }
            return false;
        };

        /**
         * 从用户列表中删除指定的用户
         * @param userId
         */
        this.deleteUserFromUserList = function(userId){
            var id = null;
            for(var i=0;i<this.currVideoUsers.length;i++){
                if(this.currVideoUsers[i].userId == userId){
                    id = i;
                }
            }
            if(id!=null && id>=0){
                this.currVideoUsers.splice(id,1);
            }
        }
    }


    /**
     * 根据当前用户数，获取适合的分屏数
     * 特别是当用户数量变化的时候，需要重新获取合适的分屏数
     * @param userCount 用户数量
     * @returns {*}
     */
    videomcu.prototype.getScreenNumByUserNum = function(userCount){
        var screenNum = 0;
        if(userCount == null || userCount <=0){
            console.log("获取分屏数失败，因用户数不合法,", userCount);
            return null;
        }

        if(userCount>=1 && userCount<=10){
            screenNum = userCount;
        }else if(userCount > 10 && userCount <=13){
            screenNum = 13;
        }else if(userCount >13){
            screenNum = 16;
        }

        return screenNum;
    };

    /**
     * 初始化视频双击事件，用于视频的最大化显示和还原
     * @param videoContainerId  用于存储所有视频的父容器id
     */
    videomcu.prototype.initEnlargeVideo = function (videoContainerId) {
        //绑定视频双击放大事件，即使视频被动态的增减，双击都有效
        $("#" + videoContainerId).on("dblclick","video",function() {
            $(this)[0].webkitRequestFullScreen();
            if (document.webkitExitFullscreen){
                $(this)[0].webkitExitFullscreen();
            }
        });
    };

    /**
     *绑定静音事件
     *
     * */
    videomcu.prototype.initMuteVideo = function(){

        $("input[id^='mute_img_']").click(function(){
            if($(this).attr("src") == "mute_image/Mute_Button_Off.png"){
                $(this).attr("src","mute_image/Mute_Button_On.png");
                //alert("静音");
            }else{
                $(this).attr("src","mute_image/Mute_Button_Off.png");
                //alert("发言");
            }
        });

    };

    /**
     * 根据div1_元素分别获取用户id，然后交换用户视频的videoPostion
     *
     * */

    videomcu.prototype.swapUserVideoPosition = function(ele1,ele2){
        var ele1_div1_id = ele1.children("div").get(0).id;
        var ele1_userId = ele1_div1_id.substr(5);//获取被覆盖元素1的id,因为确定是截取前面5个元素，因此从第五个元素一直截取到字符串结束
        var ele2_div1_id = ele2.children("div").get(0).id;
        var ele2_userId = ele2_div1_id.substr(5);//获取被覆盖元素2的id,因为确定是截取前面5个元素，因此从第五个元素一直截取到字符串结束
        var ele_obj1;
        var ele_obj2;
        // 此处是为了获取元素的位置
        for(var i=0;i<this.currVideoUsers.length;i++){
            if(this.currVideoUsers[i].userId == ele1_userId){
                ele_obj1 = this.currVideoUsers[i];

            }
            if(this.currVideoUsers[i].userId == ele2_userId){
                ele_obj2 = this.currVideoUsers[i];
            }
        }
        console.log("此处获得到"+ele1_userId+"位置:["+ele_obj1.videoPosition+"], 此处获得到"+ele2_userId+"位置:["+ele_obj2.videoPosition+"]");

        //此处是为了交换元素的位置
        var temp = ele_obj1.videoPosition;
        ele_obj1.videoPosition = ele_obj2.videoPosition;
        ele_obj2.videoPosition = temp;
    };


    /**
     * 初始化视频拖动事件，用于视频拖动交换
     */
    videomcu.prototype.initSwapVideo = function(){
        var originalElementHtml;
        var targetDraggableStyle;
        var targetDraggable;
        var that = this;
        initSwap();
        function initSwap() {
            initDroppable($("div[id^='div1_']"));
            initDraggable($("div[id^='div1_']"));
        }

        function initDraggable($elements) {
            $elements.draggable({
                appendTo: "body",
                helper: "original",
                cursor: "move",
                revert: "invalid",
                start: function(event,ui){
                    console.log("开始拖动" + event + ui);
                    originalElementHtml = $(this).parent().html();
                    targetDraggable = $(this).parent().clone(true);//克隆一个拖动元素的父元素的节点
                    targetDraggableStyle = targetDraggable.children("div").children("div").get(0).style.cssText;//获取div2_元素的样式
                }
            });
        }

        function initDroppable($elements) {
            $elements.droppable({
                activeClass: "ui-state-default",
                hoverClass: "ui-drop-hover",
                accept: ":not(.ui-sortable-helper)",
                drop: function (event, ui) {
                    var targetDroppable = $(this).parent().clone(true);//克隆一个被覆盖元素的父节点
                    var targetDroppableStyle = targetDroppable.children("div").children("div").get(0).style.cssText;//获取被覆盖元素div2_元素的样式
                    that.swapUserVideoPosition(targetDraggable,targetDroppable);//将两个元素的位置交换

                    targetDroppable.children("div").children("div").get(0).setAttribute("style",targetDraggableStyle);//被覆盖方的div2_样式修改为拖拽元素的样式
                    $(ui.draggable).parent().html(targetDroppable.html());//将被覆盖元素放到拖拽方的位置

                    targetDraggable.children("div").children("div").get(0).setAttribute("style",targetDroppableStyle);//被拖拽方的div2_样式修改为被覆盖元素的样式
                    $(this).parent().html(targetDraggable.html());//将拖拽元素放到被覆盖元素方的位置
                    initSwap();
                }
            });
        }
    };


    /**
     * 用于初始化分屏设置，比如设置默认图片等
     * @param infos 用于初始化的相关属性，包含以下信息：
     *               defaultImgPath:  无视频显示的默认图片地址
     *               videoContainerId: 用于放MCU视频的容器id，容器一般为idv
     */
    videomcu.prototype.init = function (infos) {
        if (infos.defaultImgPath != null && infos.defaultImgPath.length > 0) {
            this.defaultImgPath = infos.defaultImgPath;
        }

        if (infos.videoContainerId != null && infos.videoContainerId.length > 0) {
            this.videoContainerId = infos.videoContainerId;
        }

        if(infos.localVideoUserId != null && infos.localVideoUserId.length > 0){
            this.localVideoUserId = infos.localVideoUserId;
        }

        //初始化视频最大时的相关操作
        this.initEnlargeVideo(infos.videoContainerId);
    };

    /**
     * 清理分屏页面，并回复到初始状态
     */
    videomcu.prototype.cleanUp = function(){
        $("#" + this.videoContainerId).html("");
        this.currVideoUsers = [];
    };

    /**
     * 更新视频用户信息，比如用户videoURL/videoPosition产生变更等等
     * 此操作不会触发自动分屏
     * @param userInfo
     */
    videomcu.prototype.updateUserVideo = function (userInfo) {
        console.log("开始更新UserVideo", userInfo);
        var userId = userInfo.userId;
        if (IsStringEmpty(userId) || IsStringEmpty(userInfo.videoURL)) {
            console.warn("更新视频用户失败，因参数不合法", userInfo);
            return;
        }

        for (var i = 0; i < this.currVideoUsers.length; i++) {
            if (this.currVideoUsers[i].userId == userId) {
                console.log("找到对应的视频用户，userId为" + userId);
                this.currVideoUsers[i].videoURL = userInfo.videoURL;
                //更新用户对应的video标签src地址
                $("#video-" + userId).attr("src",userInfo.videoURL);

                if(!IsStringEmpty(userInfo.videoPosition)){
                    this.currVideoUsers[i].videoPosition = userInfo.videoPosition;
                }
            }
        }
    };

    /**
     * 增加新的视频用户,如果用户已经在视频中存在，则更新相关的信息
     * @param userInfos  用户信息数组，用于保存用户视频相关信息，如userId、userName、videoURL、videoPostion、videoParam等
     */
    videomcu.prototype.addUserVideo = function(userInfos){
        console.log("开始增加视频用户", userInfos);
        if(userInfos==null || userInfos.length==0){
            console.warn("增加视频用户失败，因参数不合法", userInfos);
            return;
        }

        this.currVideoUsers = this.currVideoUsers.concat(userInfos);
        //对视频用户进行重新编号
        this.currVideoUsers = this.reIndexUsers(this.currVideoUsers);

        //新增用户后，重新分屏
        var videoCount = this.getScreenNumByUserNum(this.currVideoUsers.length);
        this.SplitVideoScreen(videoCount);
    };

    /**
     * 删除指定的视频用户
     * @param userId    用户id
     */
    videomcu.prototype.removeUserVideo = function(userId){
        if(IsStringEmpty(userId)){
            console.warn("移除视频用户失败，因userId为空");
            return;
        }

        //查找用户并删除
        if(this.isUserExists(userId)){
            console.log("开始移除用户，并将被移出视频位置置为默认图片");
            this.deleteUserFromUserList(userId);

            $("#div1_" + userId).parent().html(this.getDefaultImgDiv());
        }else{
            console.log("移除视频用户失败，未根据用户id[" + userId + "]找到对应的视频用户")
        }
    };

    /**
     * 对用户视频进行分屏，并附加到指定的容器中
     * @param screenNum 分屏数，现有的分屏数有1、2、3、4、5、6、7、8、9、10、13、16
     * @param userInfos 用户视频信息，该参数可以为空，如果之前调用过分屏方法的话。
     *                   含有以下属性:
     *                          userId：用户id
     *                          userName： 用户名称
     *                          videoURL： 用户视频URL
     *                          videoParam： video标签中用到的视频参数
     *                          videoPosition：用户视频显示位置
     */
    videomcu.prototype.SplitVideoScreen = function (screenNum, userInfos) {
        console.log("开始分屏，参数为screenNum:" + screenNum + ", userInfos:" , userInfos);
        var screenTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 16];
        if (screenTypes.indexOf(screenNum) < 0) {
            console.log("分屏失败，因分屏数不合法，分屏数为" + screenNum);
            return;
        }

        //如果之前存储过视频用户，并且没有指定新用户的话，则使用原先的用户进行分屏
        if(userInfos == null || userInfos.length==0){
            if(this.currVideoUsers.length ==0){
                console.log("分屏失败，需指定视频用户");
                return;
            }else{
                console.log("因参数中userInfo为空，使用原有的视频用户进行分屏");
                userInfos = this.currVideoUsers;
            }
        }else{
            this.currVideoUsers = userInfos;
        }

        this.currScreenSplitNum = screenNum;

        //生成用于分屏布局的table，并加载到页面中
        //noinspection JSValidateTypes
        document.getElementById(this.videoContainerId).innerHTML = this.getSplitHTML(screenNum);

        //用户存放视频video标签
        var videoTagList = [];
        //遍历用户，并生成video标签
        if (userInfos.length > 0) {
            var videoTag;
            for (var i = 0; i < userInfos.length; i++) {
                videoTag = this.buildVideoTag(userInfos[i]);
                this.addVideoTag(videoTagList, videoTag, userInfos[i].videoPosition);
            }

            //将视频附加到页面表格中
            this.attachVideoToTable(videoTagList, VIDEO_TABLE_NAME);
        }

        //如果是3分屏，则调整第一屏的样式，避免被拉的很宽
        if(screenNum == 3){
            console.log("3分屏，需要调整第一屏样式，居中显示");
            $("td:first div").find("div[id^='div2_']").attr("style","text-align:center;border:0 black solid;width:50%;height:100%;position:absolute;left:25%;overflow: hidden;");
        }

        //获取所有td的个数
        var tdLength = $("#"+this.videoContainerId).find('td').length;
            console.log("获取所有td的个数"+tdLength);
        this.initMuteVideo();
        this.initSwapVideo();
    };

    return new videomcu();
};
