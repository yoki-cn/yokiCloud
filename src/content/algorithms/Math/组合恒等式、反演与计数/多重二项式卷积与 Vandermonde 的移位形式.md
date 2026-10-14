---
kind: algorithm
title: 多重二项式卷积与 Vandermonde 的移位形式
updated: 2026-10-12
status: draft
order: 1011900
tags:
  - 组合数学
  - 计数
---

对非负整数 $r,s,m,n$，规定越界的普通组合数为 $0$：

不要把已截短范围的 $\sum_{k=0}^r\binom{r-k}{m}\binom{s+k}{n}$ 直接写成单个二项式；例如 $r=0,m=0,s=2,n=0$ 时左边是 $1$，而 $\binom{r+s+1}{m+n+1}=3$。安全的通式是


$$
\sum_{k=0}^{N}\binom{k}{m}\binom{N-k}{n}=\binom{N+1}{m+n+1},\qquad N\ge0,
$$


其中所有普通组合数上标都非负。将 $k\mapsto r-k$，若令 $N=r+s$，必须保证 $s+k$ 的所有非零项都在原截断区间内，才能写为上一种有界和。推荐赛场使用后一条全范围恒等式，避免截断误用。

**带重复上标的多重 Vandermonde**（$n_i\ge0$）：


$$
\binom{n_1+\cdots+n_t}{m}=\sum_{k_1+\cdots+k_t=m}\prod_{i=1}^t\binom{n_i}{k_i}.
$$
