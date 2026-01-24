import { useEffect } from 'react';

export default function UseFadeIn() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-visible');
                    }
                });
            },
            { threshold: 0.1 } // Trigger when 10% of the element is in view
        );

        const elements = document.querySelectorAll('.fade-in');
        elements.forEach((element) => observer.observe(element));

        return () => elements.forEach((element) => observer.unobserve(element));
    }, []);
};
