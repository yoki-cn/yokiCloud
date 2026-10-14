---
kind: algorithm
title: 按倍数计数 gcd 正好等于 $d$
updated: 2026-10-12
status: draft
order: 1110400
tags:
  - 数论
  - 位运算
  - 区间统计
---

要求所有 $a_i\ge1$。定义 $c_d=\#\{i:d\mid a_i\}$，则


$$
\#\{\text{非空下标子集 }S:d\mid\gcd(a_i:i\in S)\}=F(d)=2^{c_d}-1,
$$


$$
\#\{\text{无序下标对 }(i,j):d\mid\gcd(a_i,a_j)\}=\binom{c_d}{2}.
$$


若 $G(d)$ 为 gcd **恰好等于** $d$ 的方案数，则倍数反演给出


$$
F(d)=\sum_{j\ge1}G(jd),\quad G(d)=\sum_{j\ge1}\mu(j)F(jd)=F(d)-\sum_{j\ge2}G(jd).
$$


当 $d$ 在有限值域 $[1,V]$ 内，按 $d$ 倒序可用 $O(V\log V)$ 枚举倍数。所有正整数中最长 gcd 大于 $1$ 的子序列的长度为 $\max_{p\text{ 素数}}c_p$（若没有正整数被素数整除则不存在非空方案）。
