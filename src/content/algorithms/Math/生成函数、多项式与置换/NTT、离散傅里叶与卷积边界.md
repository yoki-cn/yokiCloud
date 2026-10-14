---
kind: algorithm
title: NTT、离散傅里叶与卷积边界
updated: 2026-10-12
status: draft
order: 1021600
tags:
  - 生成函数
  - 多项式
  - 群论
---

若域中有 $n$ 次本原单位根 $\omega$，且 $n$ 可逆，


$$
\widehat a_k=\sum_{j=0}^{n-1}a_j\omega^{jk},\qquad a_j=\frac1n\sum_{k=0}^{n-1}\widehat a_k\omega^{-jk}.
$$


循环卷积在频域逐点相乘。线性卷积需补零到 $n\ge\deg A+\deg B+1$，否则会发生循环折叠。对模素数 $p$，存在 $n$ 次本原单位根要求 $n\mid p-1$；特殊常用模数 $998244353=119\cdot 2^{23}+1$ 的常见原根是 $3$。
