/**
 * WebP转PNG工具的主要脚本
 * 实现图片上传、预览、转换和下载功能
 */
document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const convertButton = document.getElementById('convert-button');
    const downloadButton = document.getElementById('download-button');
    const originalPreview = document.getElementById('original-preview');
    const convertedPreview = document.getElementById('converted-preview');
    
    // 存储上传的图片数据
    let originalFile = null;
    let convertedImageUrl = null;
    let originalImageName = '';
    
    /**
     * 处理文件上传
     * @param {File} file - 用户上传的文件
     */
    function handleFileUpload(file) {
        // 验证文件类型
        if (!file.type.startsWith('image/webp')) {
            showError('请上传WebP格式的图片');
            return;
        }
        
        originalFile = file;
        originalImageName = file.name.replace(/\.webp$/i, '');
        
        // 显示原始图片预览
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            originalPreview.innerHTML = '';
            originalPreview.appendChild(img);
            
            // 启用转换按钮
            convertButton.disabled = false;
            
            // 清空转换后的预览
            resetConvertedPreview();
        };
        reader.readAsDataURL(file);
    }
    
    /**
     * 将WebP图片转换为PNG格式
     */
    function convertWebpToPng() {
        if (!originalFile) {
            return;
        }
        
        // 添加加载动画
        convertedPreview.innerHTML = '';
        convertedPreview.classList.add('loading');
        convertButton.disabled = true;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                // 使用Canvas进行格式转换
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                // 将Canvas转换为PNG图片
                try {
                    // 获取PNG格式的数据URL
                    convertedImageUrl = canvas.toDataURL('image/png');
                    
                    // 显示转换后的图片
                    const convertedImg = document.createElement('img');
                    convertedImg.src = convertedImageUrl;
                    convertedPreview.innerHTML = '';
                    convertedPreview.appendChild(convertedImg);
                    
                    // 启用下载按钮
                    downloadButton.disabled = false;
                } catch (error) {
                    showError('图片转换失败，请重试');
                    console.error('转换错误:', error);
                }
                
                // 移除加载动画
                convertedPreview.classList.remove('loading');
                convertButton.disabled = false;
            };
            
            img.onerror = () => {
                showError('图片加载失败，请重试');
                convertedPreview.classList.remove('loading');
                convertButton.disabled = false;
            };
            
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(originalFile);
    }
    
    /**
     * 下载转换后的PNG图片
     */
    function downloadPngImage() {
        if (!convertedImageUrl) {
            return;
        }
        
        // 创建下载链接
        const link = document.createElement('a');
        link.href = convertedImageUrl;
        link.download = `${originalImageName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    /**
     * 显示错误消息
     * @param {string} message - 错误信息
     */
    function showError(message) {
        alert(message);
    }
    
    /**
     * 重置转换后的预览区域
     */
    function resetConvertedPreview() {
        convertedPreview.innerHTML = '<p class="no-preview">暂无图片</p>';
        downloadButton.disabled = true;
        convertedImageUrl = null;
    }
    
    // 设置文件上传监听器
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
    
    // 设置拖放上传功能
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });
    
    // 设置按钮点击事件
    convertButton.addEventListener('click', convertWebpToPng);
    downloadButton.addEventListener('click', downloadPngImage);
}); 