import React, { useEffect, useState } from 'react';
import { Notice } from '../../types/Notice.ts';
import axios from '../api/axios';
import {
    Box, Typography, List, ListItemText, Divider, ListItemButton, Button, Container
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Notice.css';

const NoticeList: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/notices');
                setNotices(res.data);
                setError(null);
            } catch (err) {
                console.error('공지사항 목록 불러오기 실패:', err);
                setError('공지사항을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    if (loading) {
        return (
            <Container>
                <Box mt={5} display="flex" justifyContent="center">
                    <Typography>로딩 중...</Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Box mt={5} display="flex" justifyContent="center">
                    <Typography color="error">{error}</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container>
            <div className="notice-container">
                <h2 className="notice-title">📢 공지사항</h2>
                
                {notices.length === 0 ? (
                    <div className="notice-empty">등록된 공지사항이 없습니다.</div>
                ) : (
                    <List className="notice-list">
                        {notices.map(notice => (
                            <React.Fragment key={notice.id}>
                                <ListItemButton
                                    component={Link}
                                    to={`/notices/${notice.id}`}
                                    className="notice-list-item"
                                >
                                    <ListItemText
                                        primary={
                                            <Typography className="notice-list-item-title">{notice.title}</Typography>
                                        }
                                        secondary={
                                            <Box className="notice-list-item-meta" component="span">
                                                <span>{notice.writer}</span>
                                                <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                                            </Box>
                                        }
                                    />
                                </ListItemButton>
                                <Divider key={`divider-${notice.id}`} />
                            </React.Fragment>
                        ))}
                    </List>
                )}
                
                {role === 'ADMIN' && (
                    <div className="notice-btn-container">
                        <Button 
                            variant="contained" 
                            onClick={() => navigate('/notices/write')}
                            className="notice-btn"
                        >
                            공지사항 작성
                        </Button>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default NoticeList;
