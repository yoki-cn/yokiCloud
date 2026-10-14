---
kind: algorithm
title: Vandermonde 卷积与超几何和
updated: 2026-10-12
status: draft
order: 1010300
tags:
  - 组合数学
  - 计数
---

$$
\sum_{k\in\mathbb Z}\binom rk\binom s{n-k}=\binom{r+s}n,\qquad \sum_k\binom rk\binom sk=\binom{r+s}r.
$$


$$
\sum_{k\in\mathbb Z}(-1)^k\binom rk\binom s{n-k}= [x^n](1-x)^r(1+x)^s.
$$

**带双重选择的安全恒等式**：


$$
\sum_k\binom nk\binom kr\binom{n-k}s=\binom n{r,s,n-r-s}\,2^{n-r-s}.
$$


证明中选定互不相交的 $r,s$ 个特殊元素，再将余下元素任意分到 $k$ 所属组；$r+s\le n$。另有


$$
\sum_{k=0}^n k^{\underline r}\binom nk =n^{\underline r}2^{n-r},\qquad 0\le r\le n.
$$
