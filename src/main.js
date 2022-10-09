const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const x = localStorage.getItem('x')
const xObject = JSON.parse(x)  
//第一次xObject是空的，所以用||当xObject是空时，取后者的值，当xObject是非空时，取前者的值。
const hashmap = xObject || [
    {logo: 'A', url: 'https://www.acfun.cn'},
    {logo: 'B', url: 'https://www.bilibili.com'},
]

//设置链接显示方式
const simplifyUrl = (url)=>{
    return url.replace('https://', '')
              .replace('http://', '')
              .replace('www.', '')
              .replace(/\/.*/, '') //删除/开头的内容
}
const render = ()=>{
    $siteList.find("li:not(.last)").remove() //重新渲染li的时候需要将之前的都删掉
    hashmap.forEach((node, index)=>{
        const $li = $(`<li>
            <div class="site">
                <div class="logo">${node.logo}</div>
                <div class="link">${simplifyUrl(node.url)}</div>
                <div class='close'>
                    <svg class="icon">
                        <use xlink:href="#icon-close"></use>
                    </svg>
                </div>
            </div>
        </li>`).insertBefore($lastLi)
        //用js代替a标签的点击跳转首页
        $li.on('click', ()=>{
            window.open(node.url)
        })
        $li.on('click', '.close',(e)=>{
            e.stopPropagation()  //阻止关闭按钮跳转到首页-阻止冒泡
            hashmap.splice(index, 1)  //从hashmap中找到close的那个并删除
            render()  //删掉后重新渲染hashmap到页面
        })
    })
}
render()

$('.addButton')
  .on('click',()=>{
    let url = window.prompt('请问你要添加的网址是啥？')
    if(url.indexOf('http')!==0){
        url = 'https://' + url
    }
    hashmap.push(
        {
            logo: simplifyUrl(url)[0],
            url: url
        }
    )
    render()
});

//当页面关闭的时候存储hashMap
window.onbeforeunload = ()=>{
    // console.log('页面要关闭了')
    const string = JSON.stringify(hashmap)  //将对象变成字符串，由于localStorage只能存字符串
    localStorage.setItem('x', string)  //在本地设置一个值为x的地方存string
}

// 键盘事件
$(document).on('keypress', (e)=>{
    // const key = e.key
    const {key} = e  //上面的简写形式
    for(let i=0; i<hashmap.length; i++){
        if(hashmap[i].logo.toLowerCase() === key){
            window.open(hashmap[i].url)
        }
    }
})