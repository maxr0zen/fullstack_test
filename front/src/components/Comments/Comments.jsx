import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { commentService } from '../../services/commentService';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Rating, 
    IconButton,
    Avatar,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Comments = ({ productId }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ text: '', rating: 1 });
    const [editingComment, setEditingComment] = useState(null);
    const [error, setError] = useState('');
    const [authDialogOpen, setAuthDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedComment, setSelectedComment] = useState(null);

    const loadComments = useCallback(async () => {
        try {
            const data = await commentService.getProductComments(productId);
            console.log('Полученные комментарии (полные данные):', JSON.stringify(data, null, 2));
            const commentsArray = Array.isArray(data) ? data : (data.results || []);
            console.log('Текущий пользователь (полные данные):', JSON.stringify(user, null, 2));
            setComments(commentsArray);
        } catch (error) {
            console.error('Ошибка при загрузке комментариев:', error);
            setError('Ошибка при загрузке комментариев');
            setComments([]);
        }
    }, [productId, user]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            setAuthDialogOpen(true);
            return;
        }

        if (!newComment.text.trim()) {
            setError('Пожалуйста, введите текст комментария');
            return;
        }

        try {
            if (editingComment) {
                await commentService.updateComment(editingComment.id, newComment);
                setEditingComment(null);
            } else {
                await commentService.addComment(productId, newComment);
            }
            setNewComment({ text: '', rating: 1 });
            setError('');
            loadComments();
        } catch (err) {
            console.error('Ошибка при сохранении комментария:', err);
            if (err.response?.status === 401) {
                setAuthDialogOpen(true);
            } else {
                setError(err.message || 'Ошибка при сохранении комментария');
            }
        }
    };

    const handleEdit = (comment) => {
        console.log('Начало редактирования комментария:', comment);
        if (!user) {
            setAuthDialogOpen(true);
            return;
        }
        setEditingComment(comment);
        setNewComment({ text: comment.text, rating: comment.rating });
        setMenuAnchorEl(null);
    };

    const handleDeleteClick = (comment) => {
        console.log('Подготовка к удалению комментария:', comment);
        setCommentToDelete(comment);
        setDeleteDialogOpen(true);
        setMenuAnchorEl(null);
    };

    const handleDeleteConfirm = async () => {
        if (!commentToDelete) return;

        try {
            console.log('Удаление комментария:', commentToDelete.id);
            await commentService.deleteComment(commentToDelete.id);
            setDeleteDialogOpen(false);
            setCommentToDelete(null);
            await loadComments();
        } catch (err) {
            console.error('Ошибка при удалении комментария:', err);
            setError('Ошибка при удалении комментария');
        }
    };

    const handleMenuOpen = (event, comment) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedComment(comment);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedComment(null);
    };

    const handleCancel = () => {
        setEditingComment(null);
        setNewComment({ text: '', rating: 1 });
        setError('');
    };

    const renderUserAvatar = (username) => (
        <Avatar 
            sx={{ 
                bgcolor: 'primary.main',
                width: 40,
                height: 40,
                fontSize: '1rem'
            }}
        >
            {username ? username[0].toUpperCase() : <PersonIcon />}
        </Avatar>
    );

    const renderCommentActions = (comment) => {
        console.log('Детальная проверка владельца комментария:', {
            commentId: comment.id,
            commentUser: comment.user,
            commentUserId: comment.user?.id,
            commentUserUsername: comment.user?.username,
            currentUser: user,
            currentUserId: user?.id,
            currentUserUsername: user?.username,
            isMatch: user?.id === comment.user?.id,
            isMatchUsername: user?.username === comment.user?.username
        });

        if (!user || !comment.user || user.username !== comment.user.username) {
            console.log('Пользователь не является владельцем комментария');
            return null;
        }

        console.log('Пользователь является владельцем комментария');
        return (
            <>
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, comment);
                    }}
                    sx={{ 
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main' }
                    }}
                >
                    <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl) && selectedComment?.id === comment.id}
                    onClose={handleMenuClose}
                    PaperProps={{
                        elevation: 2,
                        sx: { minWidth: 180 }
                    }}
                >
                    <MenuItem 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(comment);
                        }}
                    >
                        <ListItemIcon>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Редактировать</ListItemText>
                    </MenuItem>
                    <MenuItem 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(comment);
                        }}
                        sx={{ color: 'error.main' }}
                    >
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText>Удалить</ListItemText>
                    </MenuItem>
                </Menu>
            </>
        );
    };

    if (!Array.isArray(comments)) {
        console.error('Comments не является массивом:', comments);
        return (
            <Box sx={{ mt: 4 }}>
                <Typography color="error">
                    Ошибка при загрузке комментариев
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 3
            }}>
                Отзывы ({comments.length})
            </Typography>

            {user && (
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 3, 
                        mb: 4, 
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        backgroundColor: 'background.paper'
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Ваш отзыв"
                                value={newComment.text}
                                onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                                error={!!error}
                                helperText={error}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography component="legend" sx={{ color: 'text.secondary' }}>
                                    Ваша оценка:
                                </Typography>
                                <Rating
                                    value={newComment.rating}
                                    onChange={(_, value) => setNewComment({ ...newComment, rating: value || 1 })}
                                    min={1}
                                    size="large"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                {editingComment && (
                                    <Button
                                        variant="outlined"
                                        onClick={handleCancel}
                                        sx={{ minWidth: 100 }}
                                    >
                                        Отмена
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ minWidth: 200 }}
                                >
                                    {editingComment ? 'Сохранить изменения' : 'Опубликовать отзыв'}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Paper>
            )}

            {comments.length === 0 ? (
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 4, 
                        textAlign: 'center',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        backgroundColor: 'background.paper'
                    }}
                >
                    <Typography variant="body1" color="text.secondary">
                        Пока нет отзывов. Будьте первым, кто поделится своим мнением!
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={2}>
                    {comments.map((comment) => (
                        <Paper 
                            key={comment.id} 
                            elevation={0}
                            sx={{ 
                                p: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                backgroundColor: 'background.paper'
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {renderUserAvatar(comment.user?.username)}
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'flex-start',
                                        mb: 1
                                    }}>
                                        <Box>
                                            <Typography 
                                                variant="subtitle1" 
                                                component="div"
                                                sx={{ fontWeight: 600 }}
                                            >
                                                {comment.user?.username || 'Анонимный пользователь'}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{ mt: 0.5 }}
                                            >
                                                {format(new Date(comment.created_at), 'd MMMM yyyy, HH:mm', { locale: ru })}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Rating 
                                                value={comment.rating} 
                                                readOnly 
                                                size="small"
                                                sx={{ color: 'warning.main' }}
                                            />
                                            {renderCommentActions(comment)}
                                        </Box>
                                    </Box>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            mt: 1,
                                            color: 'text.primary',
                                            whiteSpace: 'pre-wrap'
                                        }}
                                    >
                                        {comment.text}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            )}

            {/* Диалог авторизации */}
            <Dialog
                open={authDialogOpen}
                onClose={() => setAuthDialogOpen(false)}
                aria-labelledby="auth-dialog-title"
            >
                <DialogTitle id="auth-dialog-title">
                    Требуется авторизация
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Для того чтобы оставить отзыв, необходимо войти в систему.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAuthDialogOpen(false)} color="primary">
                        Отмена
                    </Button>
                    <Button 
                        onClick={() => {
                            setAuthDialogOpen(false);
                            navigate('/auth', { state: { from: window.location.pathname } });
                        }} 
                        color="primary" 
                        variant="contained"
                    >
                        Войти
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог подтверждения удаления */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">
                    Подтверждение удаления
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить этот комментарий? Это действие нельзя отменить.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setDeleteDialogOpen(false)} 
                        color="primary"
                    >
                        Отмена
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        variant="contained"
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Comments; 