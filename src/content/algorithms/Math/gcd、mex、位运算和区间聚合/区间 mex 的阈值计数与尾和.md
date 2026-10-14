---
kind: algorithm
title: 区间 mex 的阈值计数与尾和
updated: 2026-10-12
status: draft
order: 1110600
tags:
  - 数论
  - 位运算
  - 区间统计
---

对长度 $n$ 的数组，记 $N_{\ge k}$ 为 mex 至少为 $k$ 的**非空连续子数组**数。$k\ge1$ 时，合法区间当且仅当包含 $0,1,\ldots,k-1$ 的每个值；对固定 $k$ 可以双指针 $O(n+k)$ 计算。


$$
N_{\ge0}=\frac{n(n+1)}2,\quad N_{=k}=N_{\ge k}-N_{\ge k+1},
$$


$$
\boxed{\sum_{1\le l\le r\le n}\operatorname{mex}(a_l,\ldots,a_r)=\sum_{k=1}^{n}N_{\ge k}.}
$$


最后一个恒等式并不自动给出 $O(n)$ 算法，对所有 $k$ 分别计算可能达到 $O(n^2)$。
