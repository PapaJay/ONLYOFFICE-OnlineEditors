﻿/*
 * (c) Copyright Ascensio System SIA 2010-2014
 *
 * This program is a free software product. You can redistribute it and/or 
 * modify it under the terms of the GNU Affero General Public License (AGPL) 
 * version 3 as published by the Free Software Foundation. In accordance with 
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect 
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For 
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under 
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
 #include "RunProperty.h"

namespace OOX
{
	namespace Logic
	{
		
		
		

		CRPrChange::CRPrChange()
		{
			m_pRunPr.Init();
			m_pRunPr->m_bRPRChange = true;
		}
		CRPrChange::CRPrChange(XmlUtils::CXmlNode& oNode)
		{
			m_pRunPr.Init();
			m_pRunPr->m_bRPRChange = true;

			fromXML( oNode );
		}
		CRPrChange::CRPrChange(XmlUtils::CXmlLiteReader& oReader)
		{
			m_pRunPr.Init();
			m_pRunPr->m_bRPRChange = true;

			fromXML( oReader );
		}
		CRPrChange::~CRPrChange()
		{
		}
		void CRPrChange::fromXML(XmlUtils::CXmlNode& oNode)
		{
			if ( _T("w:rPrChange") != oNode.GetName() )
				return;

			oNode.ReadAttributeBase( _T("w:author"), m_sAuthor );
			oNode.ReadAttributeBase( _T("w:date"),   m_oDate );
			oNode.ReadAttributeBase( _T("w:id"),     m_oID );

			XmlUtils::CXmlNode oNode_rPr;

			if ( m_pRunPr.IsInit() && oNode.GetNode( _T("w:rPr"), oNode_rPr ) )
				m_pRunPr->fromXML( oNode_rPr );

		}
		void CRPrChange::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nParentDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nParentDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				WritingElement *pItem = NULL;

				if ( _T("w:rPr") == sName )
					m_pRunPr->fromXML( oReader );
			}
		}
		CString CRPrChange::toXML() const
		{			
			CString sResult = _T("<w:rPrChange ");

			if ( m_sAuthor.IsInit() )
			{
				sResult += "w:author=\"";
				sResult += m_sAuthor->GetString();
				sResult += "\" ";
			}

			if ( m_oDate.IsInit() )
			{
				sResult += "w:date=\"";
				sResult += m_oDate->ToString();
				sResult += "\" ";
			}

			if ( m_oID.IsInit() )
			{
				sResult += "w:id=\"";
				sResult += m_oID->ToString();
				sResult += "\" ";
			}

			sResult += _T(">");

			if ( m_pRunPr.IsInit() )
				sResult += m_pRunPr->toXML();

			sResult += _T("</w:rPrChange>");

			return sResult;
		}
		EElementType CRPrChange::getType() const
		{
			return et_w_rPrChange;
		}
		void CRPrChange::ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )
			WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:author"), m_sAuthor )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:date"),   m_oDate )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),     m_oID )
			WritingElement_ReadAttributes_End( oReader )
		}
	} 
} 


