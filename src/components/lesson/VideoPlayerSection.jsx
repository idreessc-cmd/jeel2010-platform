import React from 'react';
import { Video } from 'lucide-react';

export const VideoPlayerSection = ({ lessonVideo }) => {
    if (!lessonVideo || !lessonVideo.videoId) {
        return (
            <div style={{
                width: '100%',
                height: '350px',
                backgroundColor: '#000',
                borderRadius: 'var(--border-radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF'
            }}>
                <span>لم يتم العثور على مقطع الفيديو الخاص بهذا الدرس</span>
            </div>
        );
    }

    const { videoId } = lessonVideo;
    // Build embedded link with parameters to minimize branding and hide sharing options
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=0&origin=${window.location.origin}`;

    return (
        <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: 'var(--secondary-color)', fontWeight: '800', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Video size={20} style={{ color: 'var(--primary-color)' }} />
                <span>شرح بالفيديو للدرس</span>
            </h4>
            
            <div style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: 'var(--border-radius-lg)' }}>
                {/* Top overlay blocking the title bar click to prevent opening in YouTube */}
                <div className="video-overlay" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '55px',
                    zIndex: 2,
                    cursor: 'default',
                    pointerEvents: 'auto'
                }}></div>
                
                {/* Bottom-right corner overlay block (blocks YouTube watch-on-youtube logo click) */}
                <div className="video-overlay-bottom" style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '50px',
                    zIndex: 2,
                    cursor: 'default',
                    pointerEvents: 'none'
                }}></div>

                <div className="video-container">
                    <iframe
                        src={embedUrl}
                        title="مشغل الدرس التعليمي"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
            
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                * ملاحظة: يتم إخفاء عناصر التحكم وروابط يوتيوب ظاهرياً فقط للتجربة (MVP). لحماية الفيديوهات كلياً من النسخ والتسريب، سيتم استخدام Bunny Stream أو Vimeo Private في نسخة الإنتاج.
            </p>
        </div>
    );
};
