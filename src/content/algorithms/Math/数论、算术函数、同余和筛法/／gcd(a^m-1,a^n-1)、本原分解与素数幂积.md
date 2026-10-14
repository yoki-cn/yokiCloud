---
kind: algorithm
title: $\gcd(a^m-1,a^n-1)$、本原分解与素数幂积
updated: 2026-10-12
status: draft
order: 1052200
tags:
  - 数论
---

对整数 $a\ge2$ 和正整数 $m,n$：


$$
\boxed{\gcd(a^m-1,a^n-1)=a^{\gcd(m,n)}-1.}
$$


对互质正整数 $a>b\ge1$：


$$
\gcd(a^m-b^m,a^n-b^n)=a^{\gcd(m,n)}-b^{\gcd(m,n)}.
$$


上式的互质条件不能省略。Gauss 平方自由指示式：


$$
\boxed{\mu(n)^2=\sum_{d^2\mid n}\mu(d).}
$$


约化剩余系的乘积（$m\ge2$）为


$$
\prod_{\substack{1\le a\le m\\\gcd(a,m)=1}}a\equiv\begin{cases}-1\pmod m,&m=2,4,p^e,2p^e\ (p\text{ 奇素数}),\\1\pmod m,&\text{其他 }m,\end{cases}
$$


其中 $m=2$ 有 $1\equiv-1\pmod2$，两种余数写法实际上相同；模 $m=1$ 不讨论乘积同余。
