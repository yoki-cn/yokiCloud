---
kind: algorithm
title: Euler 函数与 Carmichael 函数
updated: 2026-10-12
status: draft
order: 1050300
tags:
  - 数论
---

$$
\varphi(n)=n\prod_{p\mid n}\left(1-\frac1p\right)=\prod_{p^e\parallel n}p^{e-1}(p-1).
$$


$\lambda(n)$ 是所有与 $n$ 互质元素的阶的最小公倍数，定义为乘法群指数：


$$
\lambda(p^e)=\begin{cases}p^{e-1}(p-1),&p\text{ 奇素数},\\1,&p=2,e=1,\\2,&p=2,e=2,\\2^{e-2},&p=2,e\ge3,\end{cases}
$$


$$
\lambda(n)=\operatorname{lcm}_{p^e\parallel n}\lambda(p^e),\qquad \lambda(n)\mid\varphi(n).
$$


若 $\gcd(a,n)=1$，


$$
a^{\varphi(n)}\equiv1\pmod n,\qquad a^{\lambda(n)}\equiv1\pmod n.
$$


**扩展 Euler 降幂**：对任意 $a,m>1$，若 $b\ge\varphi(m)$，则


$$
a^b\equiv a^{(b\bmod\varphi(m))+\varphi(m)}\pmod m.
$$


若 $b<\varphi(m)$ 应直接用 $b$；对嵌套指数塔必须向下传递“指数是否达到阈值”的标志，不能无条件补一个 $\varphi(m)$。
