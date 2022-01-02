---   
layout:     post  
title: leetcode 第 270 场算法比赛  
description: 链表专题，难度还可以，但是差几分钟做完所有题，可惜了。       
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2020-02-18 21:30:00  
published: true  
---  


## 零、背景  


这次比赛的题目与之前都不同。  


是链表专题，难度还可以。  


可惜我速度慢了点，差几分钟就做完所有题。  


## 一、找出 3 位偶数  


题意：给若干个数字（可能有重复），任意挑选三个数字以任意顺序组合，问以得到多少个不重复的无前导零三位偶数数字。  


思路：数据量不大，枚举所有组合判断是否满足题意即可。  


复杂度：`O(n^3)`  



## 二、删除链表的中间节点  


题意：给一个链表，求删除中间节点后，剩余的链表。  
中间的定义是向下取整。  


思路： 先求链表的长度计算出中间的位置，然后循环找到删除即可。  


注意事项：长度为 1 时，删除后就是空链表了。  


## 三、从二叉树一个节点到另一个节点每一步的方向  


题意：给一个二叉树，问从一个节点到另一个节点的操作路径。  


有三种操作路径：  
向上：U  
向下左二子：L  
向下右儿子：R  


思路：经典的双参数递归题。  


递归的时候，同时记录两个查找目标的路径。  
某个子树上同时找到两个目标，则返回成功，否则返回失败。  


复杂度：`O(n)`  


```
string Dfs(TreeNode* root, int from, int to, string& src, string& dst){
    if(root->val == from) { // 标记目标是否找到
        src.push_back(' ');
    }
    if(root->val == to) {
        dst.push_back(' ');
    }

    if(root->left) {
        string s, d, ans;
        ans = Dfs(root->left, from, to, s, d);
        if(!ans.empty()) { // 子树找到两个目标
            return ans;
        }

        if(!s.empty()) { // 子树找到一个目标，记录路径
            src.swap(s); // swap，防止复杂度退化为 O(n^2)
            src.push_back('L');
        }
        if(!d.empty()) {
            dst.swap(d);
            dst.push_back('L');
        }
    }


    if(root->right) {
        ...  // 同左子树逻辑
    }

    // 当前子树 才 找到两个目标
    if(!src.empty() && !dst.empty()) {
        return CalAns(src, dst);
    }

    return string();
}
```


## 四、合法重新排列数对  


题意：给一个二元组`pairs[i] = [starti, endi]`列表。  
通过对二元组重新排列，可以做到`end[i-1] == start[i]`。  
求其中一个满足题意的重新排列后的二元组。  


题目保证一定存在答案。  


思路：  


** 构图 **  


这其实是一个图论题。  


二元组就是一条有向边。  


题目是要求找一个路径，遍历整个图，覆盖所有边。  


所以，我们需要先把边的集合转化为一个含出入度的有向图。  


```
struct Node{
    int val;
    int indeg = 0;
    int outdeg = 0;
    vector<int> next;
    int firstLinkPos = 0;
};
unordered_map<int, Node> m;
```


** 路径 **  

路径显然是一个链表，所以需要维护一个链表。  


```
struct LinkNode{
    int from = 0, to = 0;
    int next = 0, pre = 0;
};
vector<LinkNode> LinkNodeBufs;
int bufIndex = 1;
```


** 起点分析 **  


由于是需要覆盖所有边，那就可以从顶点的出入度来分析问题了。  


正常情况下，路径的起点出度为奇数，且比入度大一。  
路径的终点入度为奇数，且比出度大一。  


特殊情况下，可以形成环，此时所有顶点的入度等于出度。  



所以，我们根据上面的顶点出入度，可以找到起点。  
对于特殊情况，选择第一个顶点当做起点即可。  


```
int source = m.begin()->first; // 随便指定一个源
for(auto& p: m) {
    Node& node = p.second;
    if(node.outdeg > node.indeg) {
        source = node.val;
        break;
    }
}
```


** 剩余的环 **  


有了起点，无脑循环搜索，直到没有下条边即可。  


正常情况下，此时恰好把整个图搜索完。   


特殊情况是，某个点有一个环，即可以出去转一圈回到当前点。  


所以我们需要遍历剩余的顶点，遇到一个有边，就寻找一个环，插入到当前顶点所在的路径中。  


例如当前路径是 `a->b->c`，顶点 b 有一个环 `b->d->e->b`。  
插入到路径就是 `a->b->d->e->b->c`。  


```
InsertNode(source, 0); // 原始路径

while(edgeNum < n) { // 还有几个环
    for(auto&p: m) {
        // 在链上，且有出度，说明有环
        if(p.second.outdeg && p.second.firstLinkPos) { 
            InsertNode(p.first, p.first);
        }
    }
}
```


`InsertNode` 函数需要两个参数的原因是。  
对于原始路径，是从表头开始插入的。  
对于环，是从当前节点的父节点插入的。  



** 路径转答案 **  


```
vector<vector<int>> ans;
ans.reserve(n);

int pos = LinkNodeBufs[0].next;
while(pos) {
    LinkNode& linkNode = LinkNodeBufs[pos];
    ans.push_back({linkNode.from, linkNode.to});
    pos = linkNode.next;
}

return ans;
```


## 五、最后  


这次比赛的难度其实还可以，不过链表都属于模拟题，代码量大一些。  


最近几次比赛我都是使用标准的键盘手势敲代码的，有点慢，但是慢慢习惯了。  


再多练习一个月，应该慢慢的就敲的快了吧。  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

