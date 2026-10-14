---
kind: algorithm
title: 有限群的元素阶与 Lagrange、Cauchy 定理
updated: 2026-10-12
status: draft
order: 1022000
tags:
  - 生成函数
  - 多项式
  - 群论
---

有限群 $G$ 的子群 $H\le G$、单位元 $e$，以及任意元素 $g\in G$ 满足


$$
\boxed{|H|\mid |G|,\qquad \operatorname{ord}(g)\mid |G|,\qquad g^{|G|}=e.}
$$


若素数 $p\mid |G|$，则存在 $g\in G$ 恰有阶 $p$（Cauchy 定理）。若 $G$ 是循环群、阶为 $n$，则对每个 $d\mid n$，恰有一个 $d$ 阶子群和 $\varphi(d)$ 个阶为 $d$ 的元素：


$$
\#\{g\in G:\operatorname{ord}(g)=d\}=\begin{cases}\varphi(d),&d\mid n,\\0,&d\nmid n.\end{cases}
$$


一般群不一定循环；$p\mid |G|$ 不意味着任意 $p$ 次幂方程都有解。群作用的轨道稳定子与 Burnside 公式见 2.6。
