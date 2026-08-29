---
title: "Beautiful Linear Algebra Problem"
date: 2026-08-29
subtitle: 'Proving Weinstein-Aronszajn identity: $\det(I + AB) = \det(I + BA)$'
tags: ["maths"]
---

### Origin 
Yesterday, in an attempt to prove Weinstein-Aronszajn identity with a friend, we discovered some beautiful mathematics, so I thought I would write a blog about it.  

### The Identity

If $A$ and $B$ are matrices of size $m \times n$ and $n \times m$ respectively, then 
$$\det(I_m + AB) = \det(I_n + BA).$$ 

### Proof 

**Lemma 1.** Let $A$ and $B$ be of size $n \times n$. Then $\det(AB - xI_n) = \det(BA - xI_n)$.
{.part}

*Proof.* 

**Case I.** If $A$ is invertible, then $A^{-1} (AB - xI_n) A = BA - xI_n$. Since similar matrices have the same determinant, the lemma holds. 

**Case II.** Otherwise, let $f(t) = A - tI_n$ and $g(t) = \det(f(t)B - xI_n) - \det(Bf(t) - xI_n)$. Observe $f$ and $g$ are continuous functions. By Case I applied to $f(t)$, $g(t) = 0$ whenever $f(t)$ is invertible; that's every $t$ except the finitely many eigenvalues of $A$. Since $g$ is continuous, $g = 0$. So, $g(0) = \det(AB - xI_n) - \det(BA - xI_n) = 0$. Hence, $\det(AB - xI_n) = \det(BA - xI_n)$. <span class="qed"></span> 

**Lemma 2.** Let $A$ and $B$ be matrices of size $m \times n$ and $n \times m$. Then 
$({-x})^{n-m} \det(AB - xI_m) = \det(BA - xI_n)$.
{.part}

*Proof.* 

Let $n \geq m$ WLOG. Define $\hat A$ and $\hat B$ as both $n \times n$ matrices s.t.
\[
\hat A = \begin{pmatrix} A \\ 0 \end{pmatrix}, \qquad
\hat B = \begin{pmatrix} B & 0 \end{pmatrix}. 
\]

Then, $\hat A \hat B$ and $\hat B \hat A$ as both $n \times n$ matrices: 
\[
\hat A \hat B = \begin{pmatrix} AB & 0 \\ 0 & 0 \end{pmatrix},
\qquad
\hat B \hat A = BA.
\]

Using Lemma 1, deduce $\det(\hat A \hat B - xI_n) = \det(\hat B \hat A - xI_n)$. 

Note $\mathrm{LHS} = ({-x})^{n-m} \det(AB - xI_m)$ and $\mathrm{RHS} = \det(BA - xI_n)$. <span class="qed"></span> 

Finally, notice the identity is a special case of Lemma 2 when $x = {-1}$. <span class="qed"></span>
{.part}

### Remark 

Summary of the proof: 
- Observe a property holds for invertible matrices 
- Extend to all square matrices using a continuity argument
- Generalise to all rectangular matrices

Although there is a much more direct and shorter proof using Schur complement, going about the proof in this way has really been enlightening. 

Specifically, given that the equality statement to be proven is composed of continuous functions, it is possible to extend something that holds for invertible matrices to all square matrices.

Additionally, by padding rectangular matrices in a certain way, it is possible to generalise a result for square matrices to rectangular matrices. 




