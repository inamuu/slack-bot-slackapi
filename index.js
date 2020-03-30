var request = require('request');
var date = require('date-utils');

exports.handler = function (event, context) {

    // フォームを送信したユーザ
    var userId = event.user.id;
    var userName = event.user.name;
    var userNameChannel = userName.replace(/\./g, '')
                        .replace(/\s/g, '');

    // フォーム内容取得
    var consult_data = decodeString(event.submission.consult_data);

    // 作成するチャンネル名
    var dt = new Date();
    var today = dt.toFormat('YYYYMMDD');
    var channelName = 'tmp_channel_' + userNameChannel + '_' + today;

    // チャンネル作成
    var createChannel = {
        url: 'https://slack.com/api/conversations.create',
        headers: {
            'Authorization': 'Bearer ' + process.env.SLACK_BOT_ACCESS_TOKEN,
            'Content-Type': 'application/json'
        },
        json: {
            name: channelName,
            user_ids: [
                userId,
            ]
        }
    };

    //相談内容の投稿
    var postMessage = {
        url: 'https://slack.com/api/chat.postMessage',
        headers: {
            'Authorization': 'Bearer ' + process.env.SLACK_BOT_ACCESS_TOKEN,
            'Content-Type': 'application/json'
        },
        json: {
            channel: channelName,
            text: '*相談者:*' + '\n' + '<@' + userId + '>さん'+ '\n\n' + '*相談内容:*' + '\n' + consult_data,
        }
    };

    request.post(createChannel);
    request.post(postMessage);

};

// URLエンコードを元に戻す
function decodeString (str) {

    // 空の場合
    if (str == null) return "";

    // 半角スペースを復元
    var reg = new RegExp(/\+/, "g");
    return str.replace(reg, " ");
}

