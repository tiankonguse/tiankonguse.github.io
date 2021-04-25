---   
layout:     post  
title: leetcode 第 238 场算法比赛  
description: 战斗力大大降低了。   
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-02-18 21:30:00  
published: true  
---  


## 零、背景  


这周日按正常节奏，是需要五一调休上班的。  


不过我最近感冒了，公司空调开得比较低，周六在家一天恢复的差不多了，就计划周日请一天假继续在家休息。  


不过由于病了，脑袋比较昏沉，做比赛时战斗队大大降低了。  


## 一、K 进制表示下的各位数字总和  


题意：给一个十进制数字 n ，求将这个数字转化为 k 进制后，各位数字的十进制之和。  


思路：由于输出是各位的十进制之和，只需要依次求出各位的值，求和即可。  


```
int sumBase(int n, int k) {
    int ans = 0;
    while(n){
        ans += n % k;
        n /= k;
    }
    return ans;
}
```


## 二、最高频元素的频数  


题意：给一个数组，以及 K 次操作，每次操作可以在数组中选择一个数字加一。  
问最多 k 次操作后，返回数组中最高频元素的 最大可能频数 。  


定义：元素的 频数 是该元素在一个数组中出现的次数。  


思路：这道题的中文题目描述有点问题。  


切换到英文，可以发现就是求`maximum possible frequency`。  


理解了题意，可以发现最优解肯定是操作连续的一串数字，使得这些数字都等于最后一个数字。  


所以这道题可以先排序，然后使用双指针来维护区间和，这样就可以快速判断区间是否满足要求。  


PS：这道题被卡了整数最大值，改成 `long long` 就可以了。  


```
int maxFrequency(vector<int>& nums, int k) {
    int n = nums.size();
    sort(nums.begin(), nums.end());

    ll ans = 1;
    ll sum = nums[0], l = 0, r = 1; // [l, r)
    while(r < n){
        sum += nums[r++];
        while(l < r && (r - l) * nums[r-1] - sum > k){
            sum -= nums[l++];
        }
        ans = max(ans, r - l);
    }

    return ans;
}
```

## 三、所有元音按顺序排布的最长子字符串  


题意：给一个元音字符组成的字符串，求最长的美丽子串。  
美丽子串定义：所有元音字少出现一次，元音字母出现的顺序必须是字典序升序。  


思路：起初我读错题了，看出子串了，写了一个动态规划代码。  
写完后，测试样例没通过，一看题，是子串，那更简单了，无脑循环即可。  


正解：由于是子串，只需要记录上一个字符的状态即可。  
一旦不满足状态，重置为初始状态。  


大概分为六种状态：未知状态与五个元音为结尾的状态。  


小技巧：五个原因可以离散化，这样就可以加一减一比大小了。  


注意事项：默认状态不匹配了需要设置为未定义状态，但遇到第一个状态，需要设置为第一个状态。  



```
int longestBeautifulSubstring(string word) {
    string s = "aeiou";
    map<char, int> m;
    for(int i=0;i<s.size();i++){
        m[s[i]] =  i;
    }

    int ans = 0;
    int now = -1, num = 0; // 未定义状态
    for(auto c: word){
        int pos = m[c];
        if(now == pos || now + 1 == pos){
            num++, now = pos; // 进入下个状态
            if(now == 4){
                ans = max(ans, num); // 找到一个答案
            }
        }else{
            now = -1, num = 0; // 默认不匹配了，设置为未定义状态
            if(pos == 0){
                now = 0, num = 1; // 第一个位置特例，设置为第一个状态
            }
        }
    }

    return ans;
}
```


## 四、最高建筑高度  


题意：给 n 个建筑物，有如下规则，求最高的建筑物高度。  


规则1：所有建筑物高度都是非负整数。  
规则2：第一栋建筑物高度必须是 0。  
规则3：相邻建筑物高度不大于1。  
规则4：有一个集合，限制了某些编号建筑物的最大高度。  



思路：虽然建筑物有`10^9`个，但是集合限制只有`10^5`个。  
所以只需要特殊处理这些限制的高度即可。  


简单画下图，发现这个就是一个单调性的问题。  
但是我去看榜单，发现那时候只过了十几个人，于是猜测单点性处理比较麻烦。  


简单来说，单调队列里维护的是一个合法建筑物的最大高度列表。  


![](http://res.tiankonguse.com/images/2021/04/25/001.png)  



大概如上图，新的限高建筑物与单调栈分五种情况。  


对于前两种状态，明显限高是没意义的，直接取可以到达的最大高度即可。  
而对于状态四，只有一直向下走才行，所以直接入栈即可。  


对于状态三，比较复杂。  
这个状态总结下就是：可以到达，又有冗余。  
这个冗余可以让我们向上多走几步，使得中间有个尖尖的建筑物。  


![](http://res.tiankonguse.com/images/2021/04/25/002.png)  


当然，简单计算一下，发现存在奇偶性问题，即有时候得到的尖是平的。  


所以这里就又分三种子状态的组合：向上、平、向下。  


第一种组合是纯粹的先上再下。  
第二种组合是平着，此时两个建筑物是挨着，且限高等于当前高度。  
第三种组合是先上一平，此时限高恰好比可到达低一个单位。  
第四种组合是先上一平再下，这个与第一种类似，不过是奇偶性的问题导致的。  


可到达的状态都处理完了，最后一种就是向下不可到达的状态了。  
由于不可到达，栈中的最后一个建筑物高度过高，需要进行调整。  


简单画图可以发现，可以直接贪心删除栈中的最后一个建筑物，然后继续按照上面的逻辑处理即可。  


正确性疑问：倒数第一个建筑物不可达当前建筑物，那第二个建筑物到达当前建筑物时，会不会使得倒数第一个建筑物的实际高度超过限制高度呢？  


简单分析栈中建筑物的特征，发现栈中相邻两个建筑物的关系分三种情况：向上45度、相同高度、向下45度。  
根据这个特征，我们便可以证明，上面的正确性疑问是不存在的。  


所以贪心正确。  


PS：可以发现，上面分了一五种状态，而其中一个状态又分了几种子状态。  
通过画图，可以发现这些状态是可以合并的，不过合并后不容易理解，这里就不展开合并的逻辑了。  



注意事项：单点性是基于限高处理的，只能得到限高建筑物之前的最大高度。
题目要求的是前 n 个建筑物的最大高度，所以需要人为给最后那个建筑物增加个限高。  



```
int maxBuilding(int n, vector<vector<int>>& restrictions) {
    sort(restrictions.begin(), restrictions.end(), [](auto&a, auto&b){
        return a[0] < b[0];
    });


    if(restrictions.size() == 0 || restrictions[restrictions.size()-1][0] != n){
        restrictions.push_back({n, n-1}); // 人为增加限高
    }


    // 使用栈维护一个凸包
    stack<pair<ll, ll>> sta; //{id, heigh}
    sta.push({1, 0});

    for( auto& v: restrictions){
        ll id = v[0], maxHeight = v[1];
       // printf("id=%lld, maxHeight=%lld\n", id, maxHeight);

        // 此时，栈中至少有一个元素
        while(!sta.empty()){
            auto p = sta.top();

            ll dis = id - p.first;
            ll up = p.second + dis;
            ll down = p.second - dis;


            //一直向上走，可以到达最大值 up
            if(up <= maxHeight){
                sta.push({id, up});
                break;
            }

            // 恰好可以向下走，到达最底部
            if(down == maxHeight){
                sta.push({id, down});
                break;
            }

            // 位于中间，还是先向上再向下
            if(down < maxHeight){
                // 列出方程，计算出中间的折点
                ll len = (id + maxHeight - p.first - p.second)/2;
                ll newid = p.first + len;
                ll newHeight = p.second + len;


                // 第一种情况，纯粹的先上再下
                if(id - newid == newHeight - maxHeight){
                    sta.push({newid, newHeight});
                    sta.push({id, maxHeight});
                    break;
                }

                // 第二种情况：一平
                if(p.first + 1 == id){
                    sta.push({id, maxHeight});
                    break;
                }

                // 第三种情况，先上，一平
                if(newid + 1 == id){
                    sta.push({newid, newHeight});
                    sta.push({id, maxHeight});
                    break;
                }

                // 第四种情况，先上，一平，再下

                sta.push({newid, newHeight});
                sta.push({newid+1, newHeight});
                sta.push({id, maxHeight});
                break;
            }

            // 此时无法到达，这个点没用了
            sta.pop(); 
        }

    }

    ll ans  = 0;
    while(!sta.empty()){
        auto p = sta.top(); sta.pop();
        ans = max(ans, p.second);
    }

    return ans;
}
```


## 五、最后  


这次比赛的前三题还算简单，最后一题有点难度，而且代码量比较大，细节比较多。  
最后一题你是怎么做的呢？  



思考题：第三题如果是求元音的最长子序列，该如何做呢？  




加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

