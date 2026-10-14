---
kind: algorithm
title: 阶、离散对数与 BSGS
updated: 2026-10-12
status: draft
order: 1051000
tags:
  - 数论
---

若 $\gcd(a,m)=1$，$a$ 模 $m$ 的乘法阶 $\operatorname{ord}_m(a)$ 是最小正整数 $t$ 使 $a^t\equiv1\pmod m$，且


$$
\operatorname{ord}_m(a)\mid\lambda(m)\mid\varphi(m).
$$


BSGS 解 $a^x\equiv b\pmod m$，在单位群上令 $x=it+j$，$t=\lceil\sqrt N\rceil$（$N$ 为已知阶上界），


$$
a^{it}=b(a^{-j})\pmod m\quad\text{或}\quad (a^t)^i=b a^{-j}\pmod m.
$$


所需时间/空间通常 $O(\sqrt N)$。若 $\gcd(a,m)\ne1$，先做 exBSGS 的 gcd 剥离，不能直接求不存在的逆元。
