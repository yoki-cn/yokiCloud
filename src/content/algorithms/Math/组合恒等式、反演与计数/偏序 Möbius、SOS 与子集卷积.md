---
kind: algorithm
title: 偏序 Möbius、SOS 与子集卷积
updated: 2026-10-12
status: draft
order: 1011700
tags:
  - 组合数学
  - 计数
---

有限局部有限偏序 $P$ 上，$F(x)=\sum_{y\preceq x}f(y)$ 当且仅当


$$
f(x)=\sum_{y\preceq x}\mu(y,x)F(y),\quad\mu(x,x)=1,\quad\sum_{x\preceq z\preceq y}\mu(x,z)=[x=y].
$$


布尔格：$\mu(S,T)=(-1)^{|T|-|S|}$（$S\subseteq T$）。整除偏序：$\mu(a,b)=\mu_{\rm number}(b/a)$（$a\mid b$）。

**OR 卷积** $h(S)=\sum_{A\cup B=S}f(A)g(B)$：对各函数先做子集 Zeta 变换，然后逐点相乘，最后 Möbius 逆变换。

**不交子集卷积** $h(S)=\sum_{A\sqcup B=S}f(A)g(B)$：按 $|A|$ 分层 Zeta，逐层卷积，再 Möbius 逆变换取第 $|S|$ 层；一般复杂度 $O(n^2 2^n)$。两类卷积并不相同。
