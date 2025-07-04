---   
layout:     post  
title: 分析了基金间股票关系，发现优质股票    
description: 好股票会吸引好基金来购买。   
keywords: 理财,股票,投资策略  
tags: [理财,股票,投资策略]    
categories: [理财]  
updateDate:  2021-02-22 21:30:00  
published: true  
---  


## 零、背景  


之前梳理了我的《[投资策略](https://mp.weixin.qq.com/s/w73ZrA-wamXiWktDoIgbiw)》。  
在文章中提到，我主要有指数ETF 定投，主动性股票基金定投，大V跟投，以及部分现金买A股、港股、美股股票。  


而在谈买股票的原因时，提到各种投资理财，钱最终都流向了股票。  


于是我突发奇想，问自己了一个问题：定投的主动型基金、大V 基金最终都买了哪些股票呢？  


优质股票就那么多，好股票会吸引好基金来购买。  
那这些股票重合度有多高呢？  


面对这个疑问，我打算使用程序跑下数据，把基金的股票关系抓出来，分析下基金间股票的关系。  


## 一、理论支持  


在国内，基金没有把自己持有的股票全部公布出来。  
但是，政策要求，每个基金需要公布重仓的 TOP 10 股票 和 TOP 5 债券。  
而且，每个基金每季度的 TOP 10 的股票互联网上都可以查到。  


我分析了下我定投的主动型基金数据，每个基金的 TOP 10 股票总权重占比都超过了 50%。  


这样看来，只看着 TOP 10 的股票，由此分析出的数据也是有很大的可信度的。  


## 二、技术支持  


对于画图，使用前端 js 库实现再合适不过了。  


四五年前我曾写过大量的前端代码。  


时隔多年，我已经远离前端的技术圈，不知道现在使用什么库来画网状图比较方便快捷了（如果你有推荐的，可以留言告诉我）。  


一顿 google 搜索，发现可以使用的库非常多，最终我选择了一个有 demo 可以直接拿来使用的 raphae 向量 js 库。  


之所以使用这个库，是因为官方提供了一个 demo，我只需要输入基金与股票的关系，就可以直接画出一个网状图了。  


虽然画出的曲线不是那么优美，但是可以拖动，凑活着使用了。  



## 三、优质股票  


还是在《[重新梳理我的投资策略](https://mp.weixin.qq.com/s/w73ZrA-wamXiWktDoIgbiw)》文章中，我提到跟投大V、定投ETF、定投基金三种定投。  


涉及的具体基金如下。  


![](https://res.tiankonguse.com/images/2021/02/22/001.png)  


我在表格里梳理的清清楚楚，除了个别大V 是跟投的，其他的大V，以及华泰证券的指数ETF和支付宝的主动基金，都是自动定投的，我不需要做任何操作。  


PS1：你没看错，华泰证券可以定投ETF，甚至股票也可以定投。  


![](https://res.tiankonguse.com/images/2021/02/22/002.png)  



跑题了，回到基金的话题。  



对于这些基金，我收集了每个基金的 TOP 10 股票，画出了关系图。  


如下图，好股票大部分基金都会购买。  


![](https://res.tiankonguse.com/images/2021/02/22/003.png)  


比如买的最多的就是中国平安、贵州茅台、腾讯控股、五粮液。  
买的次多的是海康威视、双汇发展、三一重工、小米集团、美团、海尔智家、福耀玻璃、药明康德、迈瑞医药。  
再接着是招商银行、美的集团、比亚迪股份、顺丰控股、伊利股份、爱尔眼科、宁德时代等，太多了不一一念了。  


当然，由于我只分析的我定投的基金，数据量比较小，可能存在偏差。  


但这也可以得出一些简单结论来，尤其是最多和次多的股票，说明是国内大家比较看好的公司吧。  


## 四、最后  


微信上这个图片可能不是很清晰，想看高清数据的，可以后台回复“基金股票关系”。  
然后你可以获取一个网页地址，使用电脑谷歌浏览器打开，可以看到实时的数据。  


如果你也有感觉不错的基金，可以留言告诉我，我也加进去。  
这样随着样本的扩大，数据也越准确吧。  


对了，上篇文章发出来后，不少人问我关注哪些大V，买了哪些支付宝基金。  
投资理财存在风险，我就不公开说了。  


这里可以新增一个福利，按照上篇文章的指引开户成功后，我会拉你进我的投资读书技术群，里面会讨论投资理财。  



加油，理财人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

