---
kind: algorithm
title: 第一类与第二类 Stirling 数
updated: 2026-10-12
status: draft
order: 1010700
tags:
  - 组合数学
  - 计数
---

第一类**无符号** $c(n,k)$ 是 $n$ 元置换恰有 $k$ 个环的数量；**有符号** $s(n,k)=(-1)^{n-k}c(n,k)$。第二类 $S(n,k)$ 是将 $n$ 个可区分元素分成 $k$ 个非空无序集合的方案数。


$$
c(n,k)=c(n-1,k-1)+(n-1)c(n-1,k),
$$


$$
S(n,k)=S(n-1,k-1)+kS(n-1,k),
$$


$$
x^{\overline n}=\sum_{k=0}^n c(n,k)x^k,\quad x^{\underline n}=\sum_{k=0}^n s(n,k)x^k,\quad x^n=\sum_{k=0}^nS(n,k)x^{\underline k}.
$$


$$
S(n,k)=\frac1{k!}\sum_{j=0}^k(-1)^{k-j}\binom kj j^n,\quad k!S(n,k)=\sum_{j=0}^k(-1)^j\binom kj(k-j)^n.
$$


$$
\sum_{n\ge k}S(n,k)\frac{x^n}{n!}=\frac{(e^x-1)^k}{k!},\quad\sum_{n\ge k}c(n,k)\frac{x^n}{n!}=\frac1{k!}\left(\log\frac1{1-x}\right)^k.
$$


$$
\sum_{k=0}^n S(n,k)x^k=B_n(x),\quad\sum_{k=0}^n c(n,k)=n!,\quad \sum_{k=0}^nS(n,k)k!=\text{第 }n\text{ 个有序 Bell 数}.
$$


边界：$c(0,0)=S(0,0)=1$，$c(n,0)=S(n,0)=0$（$n>0$），越界值为零。
