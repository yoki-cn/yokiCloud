---
kind: algorithm
title: Eulerian 数、下降段与 Worpitzky 恒等式
updated: 2026-10-12
status: draft
order: 1011100
tags:
  - 组合数学
  - 计数
---

记 $A(n,k)$ 为 $n$ 元置换中恰有 $k$ 个下降位置（$\pi_i>\pi_{i+1}$）的方案数，$0\le k<n$。


$$
A(n,k)=(k+1)A(n-1,k)+(n-k)A(n-1,k-1),\quad A(1,0)=1,
$$


$$
A(n,k)=\sum_{j=0}^{k+1}(-1)^j\binom{n+1}j(k+1-j)^n,
$$


$$
x^n=\sum_{k=0}^{n-1}A(n,k)\binom{x+k}{n}\quad(n\ge1),
$$


$$
\sum_{m\ge0}m^nx^m=\frac{\sum_{k=0}^{n-1}A(n,k)x^{k+1}}{(1-x)^{n+1}}\quad(n\ge1).
$$


$A(n,k)=A(n,n-1-k)$。指定每个下降位置集合可先按无下降块分链，数所有符合弱约束的排列，再在链边做包含排除。
