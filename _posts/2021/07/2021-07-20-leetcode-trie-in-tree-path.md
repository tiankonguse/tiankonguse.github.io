---   
layout:     post  
title: leetcode 1938：树上路径的 trie 字典树  
description: 动态维护字典树，原来这么简单。   
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2021-07-20 21:30:00  
published: true  
---  


## 一、背景  


周末参加了《[leetcode 第 250 场算法比赛](https://mp.weixin.qq.com/s/5cTqAOMvv45oQ3ambTPJ3Q)》，当时最后一题是树上路径的字典树，没思路。  


赛后本来想去研究一下的，结果有朋友直接评论说：DFS 就可以了，回溯时动态维护 trie 即可。  


我恍然大悟，原来这道题这么简单。  


之前做的 Trie 都是静态的，这次与树结合起来，有意思。  


下面分享下这道题的解题思路。  


## 二、题意 


题意其实很简单，给一个有根树，以及一些询问。  
给一个节点 node 和 值 val，问节点到根之间的路径中，哪个节点与值 val 异或值最大，即求异或后的最大值。  


树的大小是 N , 询问的个数是 M，暴力计算最坏的复杂度是 `O(N M)`。  
所以需要找一个方法来快速查询。  


## 三、分析  


对于一个询问，如果我们已经对这个路径预先建立了 trie 树，就可以使用 `log(N)` 的复杂度在 trie 上快速找到答案。  


那如何才能得到只有这个路径的 trie 树呢？  


答案是递归遍历树的时候，动态维护 trie 树即可。  


## 四、预处理


面对输入，首先我们需要预处理，建立一个树，以及计算出每个节点有哪些询问。  


数据结构：  


```
vector<vector<int>> tree(n);
vector<vector<pair<int, int>>> query_nodes(n);
```

预处理构建树的时候，顺便保存根节点。  


```
int root_pos = -1;
for (int i = 0; i < n; i++) {
    if (parents[i] == -1) {
        root_pos = i;
    } else {
        tree[parents[i]].push_back(i);
    }
}

for (int i = 0; i < queries.size(); i++) {
    int node = queries[i][0];
    int val = queries[i][1];
    query_nodes[node].push_back({i, val});
}
```

## 五、DFS


预处理出树后，就可以对树进行递归动态构建 trie 树了。  


进入函数时，将节点插入 trie 树，返回是从 trie 树中删除。  


```
void Dfs(int node) {
    tire_tree.Insert(node); // 进来插入 trie 树

    for (auto& p : query_nodes[node]) {
        ans[p.first] = tire_tree.QueryMaxXor(p.second);
    }
    
    for (auto v : tree[node]) {
        Dfs(v);
    }

    tire_tree.Erase(node); // 出去删除 trie 树
}
```

## 六、动态 Trie 树  


动态 Trie 树与传统的 Trie 树相比，多了一个删除操作。  


另外这道题需要求异或最大值。  
而位数越高越能决定值的大小，所以需要从高位到低位来遍历建树。  


数据结构：  


```
int tire[N][kind], word[N];
pair<int, int> pre[N];
int num = 0;
```

初始化：  


```
memset(tire[0], 0, sizeof(tire[0]));
memset(tire[1], 0, sizeof(tire[1]));
pre[1] = {1, 0}; // 从 1 开始，且 1 为占位符
num = 2;
```


插入：  


```
void Insert(const int n, const int val) {
    int p = 1;
    for (int bit = 17; bit >= 0; bit--) {
        int v = (n >> bit) & 1;
        if (!tire[p][v]) { // 插入叶子时，动态初始化
            memset(tire[num], 0, sizeof(tire[num]));
            word[num] = 0;
            pre[num] = {p, v};
            tire[p][v] = num++;
        }
        p = tire[p][v];
    }
    word[p] = val;
}
```


删除：  


```
void Erase(const int n) {
    int p = 1;

    // 先找到叶子节点
    for (int bit = 17; bit >= 0; bit--) {
        int v = (n >> bit) & 1;
        p = tire[p][v];
    }

    // 逆向的删除空叶子
    word[p] = 0;
    while (p != 1 && word[p] == 0 && tire[p][0] == 0 && tire[p][1] == 0) {
        auto father = pre[p];
        tire[father.first][father.second] = 0;
        if (p + 1 == num) {
            num--; // 一个小优化，空间回收
        }
        p = father.first;
    }
}
```


查询：  


```
int QueryMaxXor(const int val) {
    int p = 1;
    for (int bit = 17; bit >= 0; bit--) {
        int v = (val >> bit) & 1;
        int xor_v = 1 - v;

        if (tire[p][xor_v]) { //取相反的 bit 位会更大
            p = tire[p][xor_v];
        } else { // 不存在相反的，只能取相同的 bit 位
            p = tire[p][v];
        }
    }
    return val ^ word[p];
}
```


## 七、最后  


这次比赛后，发现自己的思维还是不够灵活。  


从根到一个节点路径上的查询，递归是动态维护数据结构，就恰好可以得到想要的数据集对应的数据结构。  


有了这次经历，以后应该学会这个操作了。  


最后，我突然想到一个问题：如果给两个节点和一个 val，求两个节点形成的路径上的异或最大值，该如何做呢？  


加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

